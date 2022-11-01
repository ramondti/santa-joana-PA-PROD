import knex from "../../../database/db";
export class FindResourceProcedure {
  async execute(idSumarioPa) {
    const queryResource = await knex.raw(`
    SELECT
    CD_PACIENTE,
    NOME_COMPLETO,
    CODIGO_PROCEDIMENTO,
    RESULTADO_PROCEDIMENTO  
      FROM DBI_FHIR_SUMARIO_PA
    WHERE id_sumario_pa = ${idSumarioPa} 
    `);

    const resource = {
      resource: {
        resourceType: "Procedure",
        code: [
          {
            coding: [
              {
                code: `${queryResource[0].CODIGO_PROCEDIMENTO}`, //"$codigo_procedimento",
              },
            ],
          },
        ],
        subject: {
          type: "Patient",
          reference: `Patient/${queryResource[0].CD_PACIENTE}`, //"Patient/$cd_paciente",
          display: queryResource[0].NOME_COMPLETO, //"$nome_completo",
        },
        outcome: [
          {
            text: `${queryResource[0].RESULTADO_PROCEDIMENTO}`, //"$resultado_procedimento",
          },
        ],
      },
    };
    return resource;
  }
}
