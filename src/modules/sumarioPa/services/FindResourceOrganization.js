import knex from "../../../database/db";
export class FindResourceOrganization {
  async execute(idSumarioPa) {
    const queryResource = await knex.raw(`
    SELECT
    (SELECT nr_cgc FROM convenio WHERE cd_convenio =  (SELECT cd_convenio FROM atendime WHERE cd_Atendimento = DBI_FHIR_SUMARIO_PA.cd_atendimento)) AS CNPJ,
    (SELECT nm_convenio FROM convenio WHERE cd_convenio =  (SELECT cd_convenio FROM atendime WHERE cd_Atendimento = DBI_FHIR_SUMARIO_PA.cd_atendimento)) AS NM_CONVENIO
    FROM DBI_FHIR_SUMARIO_PA
   WHERE id_sumario_pa = ${idSumarioPa} 

    `);

    const resource = {
      resource: {
        resourceType: "Organization",
        id: `${queryResource[0].CNPJ}`, //"*cnpj-convenio",
        identifier: [
          {
            type: {
              text: "CNPJ",
            },
            value: `${queryResource[0].CNPJ}`, //"*cnpj-convenio",
          },
        ],
        type: [
          {
            text: "CONVENIO",
          },
        ],
        name: `${queryResource[0].NM_CONVENIO}`, //"*nome_convenio",
      },
    };
    return resource;
  }
}
