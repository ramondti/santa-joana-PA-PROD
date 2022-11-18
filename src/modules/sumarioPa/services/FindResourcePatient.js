import knex from "../../../database/db";
export class FindResourcePatient {
  async execute(idSumarioPa, CPF) {
    const queryResource = await knex.raw(`
  SELECT
    CD_PACIENTE,
    CPF,
    CNS,
    RACA,
    NOME_COMPLETO,
    (CASE WHEN SEXO = 'F' THEN 'female' ELSE 'male' END) SEXO,
    TO_CHAR(DATA_NASCIMENTO, 'YYYY-MM-DD') ||'T'||TO_CHAR(DATA_NASCIMENTO, 'HH:MM:SS')  AS DATA_NASCIMENTO
  FROM DBI_FHIR_SUMARIO_PA
  WHERE id_sumario_pa = ${idSumarioPa} 

    `);

    const resource = {
      resource: {
        id: `${queryResource[0].CD_PACIENTE}`, //"$cd_paciente",
        resourceType: "Patient",
        identifier: [
          {
            type: {
              text: "CD_PACIENTE",
            },
            value: `${queryResource[0].CD_PACIENTE}`, //"$cd_paciente",
          },
          {
            type: {
              text: "CPF",
            },
            value: `${queryResource[0].CPF}`, // `${queryResource[0].CPF}`, //"$cpf",
          },
          {
            type: {
              text: "CNS",
            },
            value: `${queryResource[0].CNS}`, //"$cns",
          },
          {
            type: {
              text: "RACA",
            },
            value: `${queryResource[0].RACA}`, //"$raca",
          },
        ],
        name: [
          {
            use: "official",
            text: queryResource[0].NOME_COMPLETO, //"$nome_completo",
          },
        ],
        gender: `${queryResource[0].SEXO}`, //"$sexo",
        birthDate: `${queryResource[0].DATA_NASCIMENTO}`, //"$data_nascimento",
      },
    };
    return resource;
  }
}
