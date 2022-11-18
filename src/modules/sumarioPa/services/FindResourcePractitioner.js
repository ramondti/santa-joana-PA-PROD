import knex from "../../../database/db";
export class FindResourcePractitioner {
  async execute(idSumarioPa, CRM) {
    const queryResource = await knex.raw(`
    SELECT 
    NUMERO_REGISTRO,
    NOME_PROFISSIONAL,
    OCUPACAO_PROFISSIONAL,
    TIPO_CONSELHO,
    UF,
    CONSELHO_CLASSE
  FROM DBI_FHIR_SUMARIO_PA
  WHERE id_sumario_pa = ${idSumarioPa} 

    `);

    const resource = {
      resource: {
        id: `${queryResource[0].NUMERO_REGISTRO}`, //"$numero_registro",
        resourceType: "Practitioner",
        active: true,
        name: [
          {
            use: "official",
            text: queryResource[0].NOME_PROFISSIONAL, //"$nome_profissonal"
          },
        ],
        qualification: [
          {
            identifier: [
              {
                type: {
                  text: "OCUPACAO_PROFISSIONAL",
                },
                value: `${queryResource[0].OCUPACAO_PROFISSIONAL}`, //"$ocupacao_profissional"
              },
              {
                type: {
                  text: "CRM",
                },
                value: `${queryResource[0].NUMERO_REGISTRO}`, //`${queryResource[0].NUMERO_REGISTRO}`, //"$numero_registro"
              },
              {
                type: {
                  text: "TIPO_CRM",
                },
                value: `${queryResource[0].TIPO_CONSELHO}`, //"$tipo_conselho"
              },
              {
                type: {
                  text: "UF_CRM",
                },
                value: `${queryResource[0].UF}`, //"$uf"
              },
            ],
            code: {
              text: `${queryResource[0].CONSELHO_CLASSE}`, //"$conselho_classe"
            },
          },
        ],
      },
    };

    return resource;
  }
}
