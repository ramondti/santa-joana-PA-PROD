import knex from "../../../database/db";

export class FindRecourceCarePlan {
  async execute(idSumarioPa) {
    const queryResource = await knex.raw(`
    SELECT
    CD_PACIENTE,
    NOME_COMPLETO,
    ID_SUMARIO_PA,
    CD_PRESTADOR_ALTA_MEDICA,
    PROFISSIONAL_ALTA_MEDICA,
    CD_ATENDIMENTO,
    ENCAMINHAMENTO_ESPECIALIDADE
    FROM DBI_FHIR_SUMARIO_PA
    WHERE id_sumario_PA = ${idSumarioPa}

    `);

    if (!queryResource[0].ENCAMINHAMENTO_ESPECIALIDADE) {
      return;
    }

    const resource = {
      resource: {
        resourceType: "CarePlan",
        status: "unknown",
        intent: "proposal",
        subject: {
          type: "Patient",
          reference: `Patient/${queryResource[0].CD_PACIENTE}`, // "Patient/$cd_paciente",
          display: queryResource[0].NOME_COMPLETO, // "$nome_completo",
        },
        encounter: {
          type: "Encounter",
          reference: `Encounter/${queryResource[0].CD_ATENDIMENTO}`, // "Encounter/$id_sumario_pa",
        },
        author: {
          reference: `Practitioner/${queryResource[0].CD_PRESTADOR_ALTA_MEDICA}`, // "Practitioner/$cd_prestador_alta_medica",
          type: "Practitioner",
          display: queryResource[0].PROFISSIONAL_ALTA_MEDICA, // "$profissional_alta_medica",
        },
        note: [
          {
            text: `${queryResource[0].ENCAMINHAMENTO_ESPECIALIDADE}`, // "$encaminhamento_especialidade",
          },
        ],
      },
    };
    return resource;
  }
}
