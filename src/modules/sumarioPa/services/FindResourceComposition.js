import knex from "../../../database/db";
export class FindResourceComposition {
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
     AS display,
     CNPJ,
     (SELECT ds_razao_social FROM multi_empresas WHERE cd_multi_empresa =(SELECT cd_multi_empresa FROM atendime WHERE cd_atendimento = DBI_FHIR_SUMARIO_INTERNACAO.cd_atendimento)) DS_RAZAO_SOCIAL,
   TO_CHAR(SYSDATE, 'YYYY-MM-DD') ||'T'||TO_CHAR(SYSDATE, 'HH:MM:SS') ||'.300z' AS data
   FROM DBI_FHIR_SUMARIO_PA
   WHERE id_sumario_PA = ${idSumarioPa}
    
    `);
    const resource = {
      resource: {
        resourceType: "Composition",
        status: "final",
        type: {
          text: "SUMÁRIO DE PRONTO ATENDIMENTO",
        },
        title: "SUMÁRIO DE PRONTO ATENDIMENTO",
        author: [
          {
            type: "Organization",
            reference: `Organization/${queryResource[0].CNPJ}`,
            display: queryResource[0].DS_RAZAO_SOCIAL,
          },
        ],
        date: queryResource[0].DATA,
      },
    };
    return resource;
  }
}
