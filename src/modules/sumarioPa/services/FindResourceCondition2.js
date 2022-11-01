import knex from "../../../database/db";
export class FindResourceCondition2 {
  async execute(idSumarioPa) {
    const queryResource = await knex.raw(`
    SELECT
    ID_SUMARIO_PA,
    DIAGNOSTICO,
    CD_PACIENTE,
    MOTIVO_ATENDIMENTO,
    NOME_COMPLETO,
    CD_ATENDIMENTO,
    MOTIVO_DESFECHO
    FROM DBI_FHIR_SUMARIO_PA
   WHERE id_sumario_PA = ${idSumarioPa}

   
    
    `);

    const resource = {
      resource: {
        resourceType: "Condition",
        id: `${queryResource[0].CD_ATENDIMENTO}-2`, // "$id_sumario_pa-2",
        code: {
          text: "DESFECHO",
        },
        subject: {
          type: "Patient",
          reference: `Patient/${queryResource[0].CD_PACIENTE}`, // "Patient/$cd_paciente",
          display: queryResource[0].NOME_COMPLETO, // "$nome_completo",
        },
        category: [
          {
            coding: [
              {
                display: "DESFECHO",
              },
            ],
            text: `${queryResource[0].MOTIVO_DESFECHO}`, //"$motivo_desfecho",
          },
        ],
      },
    };
    return resource;
  }
}
