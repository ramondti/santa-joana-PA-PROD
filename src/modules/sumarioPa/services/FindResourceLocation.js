import knex from "../../../database/db";
export class FindResourceLocations {
  async execute(idSumarioPa, CNES) {
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
     AS display,
     CNES,
     (SELECT ds_razao_social FROM multi_empresas WHERE cd_multi_empresa =(SELECT cd_multi_empresa FROM atendime WHERE cd_atendimento = DBI_FHIR_SUMARIO_PA.cd_atendimento)) DS_RAZAO_SOCIAL,
     CNPJ
   FROM DBI_FHIR_SUMARIO_PA
   WHERE id_sumario_PA = ${idSumarioPa}
    `);

    const resource = {
      resource: {
        resourceType: "Location",
        id: `${queryResource[0].CNPJ}`,
        identifier: [
          {
            type: {
              text: "CNES",
            },
            value: queryResource[0].CNES, //`${queryResource[0].CNES}`,
          },
        ],
        type: [
          {
            text: "HOSPITAL",
          },
        ],
        name: `${queryResource[0].DS_RAZAO_SOCIAL}`,
      },
    };

    return resource;
  }
}
