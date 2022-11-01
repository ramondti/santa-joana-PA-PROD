import knex from "../../../database/db";
export class FindResourceRelatedPerson {
  async execute(idSumarioPa) {
    const queryResource = await knex.raw(`
    SELECT 
    CD_PACIENTE,
    NOME_COMPLETO,
    NOME_COMPLETO_MAE
    FROM DBI_FHIR_SUMARIO_PA
    WHERE id_sumario_pa = ${idSumarioPa} 
`);

    const resource = {
      resource: {
        id: `${queryResource[0].CD_PACIENTE}-rp1`, //"$cd_paciente-rp1",
        resourceType: "RelatedPerson",
        patient: {
          type: "Patient",
          reference: `Patient/${queryResource[0].CD_PACIENTE}`, // "Patient/$cd_paciente",
          display: queryResource[0].NOME_COMPLETO, //"$nome_completo",
        },
        relationship: [
          {
            text: "mae",
          },
        ],
        name: [
          {
            use: "official",
            text: queryResource[0].NOME_COMPLETO_MAE, //"$nome_completo_mae",
          },
        ],
        language: {
          text: "portuguese",
        },
      },
    };

    return resource;
  }
}
