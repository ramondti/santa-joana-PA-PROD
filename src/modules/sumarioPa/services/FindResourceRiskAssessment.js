import knex from "../../../database/db";
export class FindResourceRiskAssessment {
  async execute(idSumarioPa) {
    const queryResource = await knex.raw(`
    SELECT
    NOME_PROFISSIONAL,
    CD_PACIENTE,
    NOME_COMPLETO,
    ID_SUMARIO_PA,
    CATEGORIA_TRIAGEM,
    IDADE_GESTACIONAL,
    QUANTIDADE_GESTACOES,
    QUANTIDADE_PARTOS,
    QUANTIDADE_ABORTO,
    CD_ATENDIMENTO,
    USO_ALCOOL,
    USO_TABACO,
    SUBSTANCIA_PSICOATIVA,
    NUMERO_REGISTRO  
    FROM DBI_FHIR_SUMARIO_PA
    WHERE id_sumario_PA = ${idSumarioPa}
    `);

    var sumarioPa = queryResource[0];

    const resource = {
      resource: {
        resourceType: "RiskAssessment",
        status: "registered",
        method: {
          text: "PESQUISA",
        },
        performer: {
          reference: `Practitioner/${sumarioPa.NUMERO_REGISTRO}`, //"Practitioner/$numero_registro",
          type: "Practitioner",
          display: queryResource[0].NOME_PROFISSIONAL, //"$nome_profissional",
        },
        subject: {
          type: "Patient",
          reference: `Patient/${sumarioPa.CD_PACIENTE}`, //"Patient/$cd_paciente",
          display: queryResource[0].NOME_COMPLETO, //"$nome_completo",
        },
        encounter: {
          type: "Encounter",
          reference: `Encounter/${sumarioPa.CD_ATENDIMENTO}`, //"Encounter/$id_sumario_pa",
        },
        prediction: [
          {
            qualitativeRisk: {
              text: `${sumarioPa.CATEGORIA_TRIAGEM}`, //"$categoria_triagem",
            },
          },
        ],
        note: [
          // {
          //   text: queryResource[0].SUBSTANCIA_PSICOATIVA, //"$substancia_psicoativa",
          // },
        ],
      },
    };

    if (sumarioPa.IDADE_GESTACIONAL) {
      resource.resource.note.push({ text: sumarioPa.IDADE_GESTACIONAL });
    }
    if (sumarioPa.QUANTIDADE_GESTACOES) {
      resource.resource.note.push({ text: sumarioPa.QUANTIDADE_GESTACOES });
    }
    if (sumarioPa.QUANTIDADE_PARTOS) {
      resource.resource.note.push({ text: sumarioPa.QUANTIDADE_PARTOS });
    }
    if (sumarioPa.QUANTIDADE_ABORTO) {
      resource.resource.note.push({ text: sumarioPa.QUANTIDADE_ABORTO });
    }
    if (sumarioPa.USO_ALCOOL) {
      resource.resource.note.push({ text: sumarioPa.USO_ALCOOL });
    }
    if (sumarioPa.USO_TABACO) {
      resource.resource.note.push({ text: sumarioPa.USO_TABACO });
    }
    if (sumarioPa.CATEGORIA_TRIAGEM) {
      resource.resource.note.push({ text: sumarioPa.CATEGORIA_TRIAGEM });
    }

    return resource;
  }
}
