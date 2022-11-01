import knex from "../../../database/db";
export class FindResourcePractitionerHigh {
  async execute(idSumarioPa) {
    const queryResource = await knex.raw(`
    
    SELECT 
      CD_PRESTADOR_ALTA_MEDICA,
      PROFISSIONAL_ALTA_MEDICA,
      ESPECIALIDADE,
      TP_CONSELHO,
      CD_UF,
      DS_CONSELHO
    FROM DBI_FHIR_SUMARIO_PA
    WHERE id_sumario_pa = ${idSumarioPa} 
`);

    const resource = {
      resource: {
        id: `${queryResource[0].CD_PRESTADOR_ALTA_MEDICA}`, //"$cd_prestador_alta_medica",
        resourceType: "Practitioner",
        active: true,
        name: [
          {
            use: "official",
            text: queryResource[0].PROFISSIONAL_ALTA_MEDICA, //"$profissional_alta_medica",
          },
        ],
        qualification: [
          {
            identifier: [
              {
                type: {
                  text: "Especialidade",
                },
                value: `${queryResource[0].ESPECIALIDADE}`, //"$especialidade",
              },
              {
                type: {
                  text: "CRM",
                },
                value: "sem-identificacao",
              },
              {
                type: {
                  text: "TIPO_CRM",
                },
                value: `${queryResource[0].TP_CONSELHO}`, //"$tp_conselho",
              },
              {
                type: {
                  text: "UF_CRM",
                },
                value: `${queryResource[0].CD_UF}`, //"$cd_uf",
              },
            ],
            code: {
              text: `${queryResource[0].DS_CONSELHO}`, //"$ds_conselho",
            },
          },
        ],
      },
    };
    return resource;
  }
}
