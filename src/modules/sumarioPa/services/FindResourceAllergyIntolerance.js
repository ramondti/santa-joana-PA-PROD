import knex from "../../../database/db";

export class FindResourceAllergyIntolerance {
  async execute(idSumarioPa) {
    const queryResource = await knex.raw(`
    SELECT 
      CD_PACIENTE,
      NOME_COMPLETO,
      CATEGORIA_AGENTE
    FROM DBI_FHIR_SUMARIO_PA
    WHERE id_sumario_PA = ${idSumarioPa}

    `);

    if (queryResource[0].CATEGORIA_AGENTE) {
      return;
    }

    const resource = {
      resource: {
        resourceType: "AllergyIntolerance",
        patient: {
          type: "Patient",
          reference: `Patient/${queryResource[0].CD_PACIENTE}`, //"Patient/$cd_paciente",
          display: queryResource[0].NOME_COMPLETO, //"$nome_completo",
        },
        reaction: [
          {
            manifestation: [
              {
                text: `${queryResource[0].CATEGORIA_AGENTE}`, //"$categoria_agente",
              },
            ],
          },
        ],
      },
    };
    return resource;
  }
}
