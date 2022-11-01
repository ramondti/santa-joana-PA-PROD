import knex from "../../../database/db";
export class FindResourceObservation2 {
  async execute(idSumarioPa) {
    const queryResource = await knex.raw(`
    SELECT
    CD_PACIENTE,
    NOME_COMPLETO,
    ID_SUMARIO_PA,
    TO_CHAR(DATA_HORA_ATENDIMENTO, 'YYYY-MM-DD') ||'T'||TO_CHAR(DATA_HORA_ATENDIMENTO, 'HH:MM:SS') as DATA_HORA_ATENDIMENTO,
    NUMERO_REGISTRO,
    NOME_PROFISSIONAL,
    DECLARACAO_SUBJETIVA,
    CD_ATENDIMENTO,
    ESCALA_DOR,
    DUM
    FROM DBI_FHIR_SUMARIO_PA
    WHERE id_sumario_pa = ${idSumarioPa} 
    `);
    var sumarioPa = queryResource[0];

    const resource = {
      resource: {
        resourceType: "Observation",
        status: "registered",
        method: {
          text: "PESQUISA",
        },
        subject: {
          type: "Patient",
          reference: `Patient/${queryResource[0].CD_PACIENTE}`, //"Patient/$cd_paciente",
          display: `${queryResource[0].NOME_COMPLETO}`, //"$nome_completo",
        },
        encounter: {
          type: "Encounter",
          reference: `Encounter/${queryResource[0].CD_ATENDIMENTO}`, //"Encounter/$id_sumario_pa",
        },
        performedDateTime: `${queryResource[0].DATA_HORA_ATENDIMENTO}`, //"$data_hora_atendimento",
        performer: {
          reference: `Practitioner/${queryResource[0].NUMERO_REGISTRO}`, //"Practitioner/$numero_registro",
          type: "Practitioner",
          display: queryResource[0].NOME_PROFISSIONAL, //"$nome_profissional",
        },
        note: [],
      },
    };

    if (sumarioPa.DECLARACAO_SUBJETIVA) {
      resource.resource.note.push({ text: sumarioPa.DECLARACAO_SUBJETIVA });
    }
    if (sumarioPa.ESCALA_DOR) {
      resource.resource.note.push({ text: sumarioPa.ESCALA_DOR });
    }
    if (sumarioPa.DUM) {
      resource.resource.note.push({ text: sumarioPa.DUM });
    }
    return resource;
  }
}
