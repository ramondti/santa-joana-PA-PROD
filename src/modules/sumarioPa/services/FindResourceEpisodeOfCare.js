import knex from "../../../database/db";
export class FindResourceEpisodeOfCare {
  async execute(idSumarioPa) {
    const queryResource = await knex.raw(`
    SELECT
    ID_SUMARIO_PA,
    CD_PACIENTE,
    NOME_COMPLETO,
    CD_ATENDIMENTO,
    PRINCIPAIS_EVENTOS
    FROM DBI_FHIR_SUMARIO_PA
   WHERE id_sumario_PA = ${idSumarioPa}
    
    `);

    if (queryResource[0].PRINCIPAIS_EVENTOS) {
      return;
    }
    const resource = {
      resource: {
        resource: {
          resourceType: "EpisodeOfCare",
          id: `${queryResource[0].CD_ATENDIMENTO}-1`, //"$id_sumario_pa-1",
          patient: {
            type: "Patient",
            reference: `Patient/${queryResource[0].CD_PACIENTE}`, // "Patient/$cd_paciente",
            display: queryResource[0].NOME_COMPLETO, //"$nome_completo",
          },
          type: [
            {
              text: `${queryResource[0].PRINCIPAIS_EVENTOS}`, //"$principais_eventos",
            },
          ],
        },
      },
    };
    return resource;
  }
}
