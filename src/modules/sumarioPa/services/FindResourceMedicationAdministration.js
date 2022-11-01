import knex from "../../../database/db";
export class FindResourceMedicationAdministration {
  async execute(cd_atendimento) {
    const queryResource = await knex.raw(`
    
    SELECT DISTINCT  
    NOME_COMPLETO,
    CD_PACIENTE,
    anvisa AS CODE,
    forma_aplicacao AS METHOD,                                                                                                                     
    qt_presc AS VALOR,                                                                                      
    unid_presc AS UNIT,
    observacao AS TEXT,
    CPF
    FROM DBINTEGRA.DBI_FHIR_SUMARIO_pa pa
    left JOIN dbintegra.dbi_fhir_medicamento_adm medicamento ON medicamento.cd_atendimento = pa.cd_atendimento
    WHERE pa.cd_atendimento = ${cd_atendimento}

`);

    var resource = [];

    queryResource.forEach((element) => {
      resource.push({
        resource: {
          resourceType: "MedicationAdministration",
          status: "completed",
          subject: {
            type: "Patient",
            reference: `Patient/${element.CD_PACIENTE}`, //"Patient/$cd_paciente",
            display: element.NOME_COMPLETO, //"$nome_completo",
          },
          dosage: {
            text: `${!element.TEXT ? "" : element.TEXT}`, //"Texto livre sobre a aplicação",
            site: {
              coding: [
                {
                  system: `https://consultas.anvisa.gov.br/#/bulario/q/?numeroRegistro=${element.CODE}`,
                  code: element.CODE, //"*codigo",
                },
              ],
            },
            method: {
              text: element.METHOD, //"*(metodo oral, inalação, etc)",
            },
            dose: {
              value: element.VALOR, //50,
              unit: element.UNIT, //"*(unidade da dose ml, gr, etc)",
            },
          },
        },
      });
    });

    return resource;
  }
}
