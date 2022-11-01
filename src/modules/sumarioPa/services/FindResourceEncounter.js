import knex from "../../../database/db";
export class FindResourceEncounter {
  async execute(idSumarioPa) {
    const queryResource = await knex.raw(`
    SELECT
    (SELECT 
  CASE                                                         
  WHEN cd_multi_empresa = 1 THEN 'SANTA JOANA'
  WHEN cd_multi_empresa = 2 THEN 'PMP'
  WHEN cd_multi_empresa = 13 THEN 'HMSM'
  END AS sigla
  FROM atendime
  WHERE cd_atendimento = DBI_FHIR_SUMARIO_PA.cd_atendimento)
   AS LOCAL_ATENDIMENTO,
  ID_SUMARIO_PA,
  CD_PACIENTE,
  NOME_COMPLETO,
  MOTIVO_DESFECHO,
  PRINCIPAIS_EVENTOS,
  MODALIDADE_ASSISTENCIAL,
   TO_CHAR(DATA_HORA_ATENDIMENTO, 'YYYY-MM-DD') ||'T'||TO_CHAR(DATA_HORA_ATENDIMENTO, 'HH:MM:SS') as DATA_HORA_ATENDIMENTO,
   TO_CHAR(DATA_ALTA_MEDICA, 'YYYY-MM-DD') ||'T'||TO_CHAR(DATA_ALTA_MEDICA, 'HH:MM:SS') as DATA_ALTA_MEDICA,
  NUMERO_REGISTRO,
  NOME_PROFISSIONAL,
  PROFISSIONAL_ALTA_MEDICA,
  PROCEDENCIA,
  CD_ATENDIMENTO,
  CNPJ,
  CD_PRESTADOR_ALTA_MEDICA,
  (SELECT nr_cgc FROM convenio WHERE cd_convenio =  (SELECT cd_convenio FROM atendime WHERE cd_Atendimento = DBI_FHIR_SUMARIO_PA.cd_atendimento)) AS CNPJ_CONVENIO,
  (SELECT nm_convenio FROM convenio WHERE cd_convenio =  (SELECT cd_convenio FROM atendime WHERE cd_Atendimento = DBI_FHIR_SUMARIO_PA.cd_atendimento)) AS NM_CONVENIO
  FROM DBI_FHIR_SUMARIO_PA
  WHERE id_sumario_PA = ${idSumarioPa}
   
   `);

    const resource = {
      resource: {
        resourceType: "Encounter",
        id: `${queryResource[0].CD_ATENDIMENTO}`, //"$id_sumario_pa",
        identifier: [
          {
            type: {
              text: "CD_ATENDIMENTO",
            },
            value: `${queryResource[0].CD_ATENDIMENTO}`, //"$id_sumario_pa",
          },
        ],
        type: [
          {
            text: `${queryResource[0].MODALIDADE_ASSISTENCIAL}`, //"$modalidade_assistencial",
          },
        ],
        subject: {
          type: "Patient",
          reference: `Patient/${queryResource[0].CD_PACIENTE}`, // "Patient/$cd_paciente",
          display: queryResource[0].NOME_COMPLETO, // "$nome_completo",
        },
        episodeOfCare: [
          {
            type: "EpisodeOfCare",
            reference: `EpisodeOfCare/${queryResource[0].ID_SUMARIO_PA}-1`, //"EpisodeOfCare/$id_sumario_pa-1",
          },
        ],
        reasonReference: [
          {
            reference: `Condition/${queryResource[0].ID_SUMARIO_PA}-1`, //"Condition/$id_sumario_pa-1",
            type: "Condition",
          },
        ],
        period: {
          start: `${queryResource[0].DATA_HORA_ATENDIMENTO}`, //"$data_hora_atendimento",
          end: `${queryResource[0].DATA_ALTA_MEDICA}`, //"$data_alta_medica",
        },
        status: "finished",
        participant: [
          {
            type: [
              {
                text: "PROFISSIONAL_ADMISSAO",
              },
            ],
            individual: {
              reference: `Practitioner/${queryResource[0].NUMERO_REGISTRO}`, //"Practitioner/$numero_registro",
              type: "Practitioner",
              display: queryResource[0].NOME_PROFISSIONAL, //"$nome_profissional",
            },
          },
          {
            type: [
              {
                text: "PROFISSIONAL_ALTA",
              },
            ],
            individual: {
              reference: `Practitioner/${queryResource[0].CD_PRESTADOR_ALTA_MEDICA}`, //"Practitioner/$cd_prestador_alta_medica",
              type: "Practitioner",
              display: queryResource[0].PROFISSIONAL_ALTA_MEDICA, //"$profissional_alta_medica",
            },
          },
        ],
        diagnosis: [
          {
            condition: {
              reference: `Condition/${queryResource[0].ID_SUMARIO_PA}-2`, //"Condition/$id_sumario_pa-2",
              type: "Condition",
            },
            use: {
              text: "DESFECHO",
            },
          },
        ],
        hospitalization: {
          admitSource: {
            text: `${queryResource[0].PROCEDENCIA}`, //"$procedencia",
          },
        },
        location: [
          {
            location: {
              reference: `Location/${queryResource[0].CNPJ}`, //"Location/$cnpj",
              type: "Location",
              display: `${queryResource[0].LOCAL_ATENDIMENTO}`, //"$local_atendimento",
            },
          },
        ],
        serviceProvider: {
          reference: `Organization/${queryResource[0].CNPJ_CONVENIO}`, //"Organization/*cnpj-convenio",
          type: "Organization",
          display: `${queryResource[0].NM_CONVENIO}`, //"*nome-convenio",
        },
      },
    };
    return resource;
  }
}
