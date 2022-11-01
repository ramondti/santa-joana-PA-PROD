import knex from "../../../database/db";
export class FindResourceObservation {
  async execute(idSumarioPa) {
    const queryResource = await knex.raw(`
    SELECT
    CD_PACIENTE,
    NOME_COMPLETO,
    ID_SUMARIO_PA,
    To_Char(DATA_HORA_ATENDIMENTO,'DD-MM-YYYY HH:MI:SS') as DATA_HORA_ATENDIMENTO,
    NUMERO_REGISTRO,
    NOME_PROFISSIONAL,
    SISTOLICA,
    DIASTOLICA,
    CD_ATENDIMENTO,
    FREQUENCIA_CARDIACA,
    TEMPERATURA,
    SATURACAO_O2,
    EXAME_FISICO_GERAL
    FROM DBI_FHIR_SUMARIO_PA
    WHERE id_sumario_pa = ${idSumarioPa} 
    `);

    var sumarioPa = queryResource[0];

    const resource = {
      resource: {
        resourceType: "Observation",
        status: "registered",
        method: {
          text: "MESURACAO",
        },
        subject: {
          type: "Patient",
          reference: `Patient/${queryResource[0].CD_PACIENTE}`, //"Patient/$cd_paciente",
          display: queryResource[0].NOME_COMPLETO, //"$nome_completo",
        },
        encounter: {
          type: "Encounter",
          reference: `Encounter/${queryResource[0].CD_ATENDIMENTO}`, //"Encounter/$id_sumario_pa",
        },
        performedDateTime: `${queryResource[0].DATA_HORA_ATENDIMENTO}`, //"$data_hora_atendimento",
        performer: {
          reference: `Practitioner/${queryResource[0].NUMERO_REGISTRO}`, //"Practitioner/$numero_registro",
          type: "Practitioner",
          display: queryResource[0].NOME_PROFISSIONAL, //"$nome_profissional",
        },
        note: [],
      },
    };

    if (sumarioPa.SISTOLICA) {
      resource.resource.note.push({ text: sumarioPa.SISTOLICA });
    }
    if (sumarioPa.DIASTOLICA) {
      resource.resource.note.push({ text: sumarioPa.DIASTOLICA });
    }
    if (sumarioPa.FREQUENCIA_CARDIACA) {
      resource.resource.note.push({ text: sumarioPa.FREQUENCIA_CARDIACA });
    }
    if (sumarioPa.TEMPERATURA) {
      resource.resource.note.push({ text: sumarioPa.TEMPERATURA });
    }
    if (sumarioPa.SATURACAO_O2) {
      resource.resource.note.push({ text: sumarioPa.SATURACAO_O2 });
    }
    if (sumarioPa.EXAME_FISICO_GERAL) {
      resource.resource.note.push({ text: sumarioPa.EXAME_FISICO_GERAL });
    }

    return resource;
  }
}
