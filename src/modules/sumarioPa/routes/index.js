import knex from "../../../database/db";
import axios from "axios";
import { FindRecourceCarePlan } from "../services/FindRecourceCarePlan";
import { FindResourceAllergyIntolerance } from "../services/FindResourceAllergyIntolerance.js";
import { FindResourceComposition } from "../services/FindResourceComposition";
import { FindResourceCondition } from "../services/FindResourceCondition";
import { FindResourceCondition2 } from "../services/FindResourceCondition2";
import { FindResourceEncounter } from "../services/FindResourceEncounter";
import { FindResourceEpisodeOfCare } from "../services/FindResourceEpisodeOfCare";
import { FindResourceLocations } from "../services/FindResourceLocation";
import { FindResourceMedicationAdministration } from "../services/FindResourceMedicationAdministration";
import { FindResourceObservation } from "../services/FindResourceObservation";
import { FindResourceObservation2 } from "../services/FindResourceObservation2";
import { FindResourceOrganization } from "../services/FindResourceOrganization";
import { FindResourcePatient } from "../services/FindResourcePatient";
import { FindResourcePractitioner } from "../services/FindResourcePractitioner";
import { FindResourcePractitionerHigh } from "../services/FindResourcePractitionerHigh";
import { FindResourceProcedure } from "../services/FindResourceProcedure";
import { FindResourceRelatedPerson } from "../services/FindResourceRelatedPerson";
import { FindResourceRiskAssessment } from "../services/FindResourceRiskAssessment";
const { v4: uuidv4 } = require("uuid");
export async function getSantaJoana() {
  try {
    console.log("### INICIANDO PROCESSO ###");

    const findResourceComposition = new FindResourceComposition();
    const findResourceLocations = new FindResourceLocations();
    const findResourceOrganization = new FindResourceOrganization();
    const findResourcePractitioner = new FindResourcePractitioner();
    const findResourcePractitionerHigh = new FindResourcePractitionerHigh();
    const findResourceRelatedPerson = new FindResourceRelatedPerson();
    const findResourcePatient = new FindResourcePatient();
    const findResourceAllergyIntolerance = new FindResourceAllergyIntolerance();
    const findResourceCondition = new FindResourceCondition();
    const findResourceCondition2 = new FindResourceCondition2();
    const findResourceEpisodeOfCare = new FindResourceEpisodeOfCare();
    const findResourceEncounter = new FindResourceEncounter();
    const findResourceProcedure = new FindResourceProcedure();
    const findResourceMedicationAdministration =
      new FindResourceMedicationAdministration();
    const findResourceRiskAssessment = new FindResourceRiskAssessment();
    const findResourceObservation = new FindResourceObservation();
    const findResourceObservation2 = new FindResourceObservation2();
    const findRecourceCarePlan = new FindRecourceCarePlan();
    const URL_SANTA_JOANA = process.env.URL_SANTA_JOANA;
    const newId = uuidv4();
    const newId2 = uuidv4();
    const newId3 = uuidv4();

    const cpf_uid = newId;
    const cns_uid = newId2;
    const crm_uid = newId3;

    const findIdSumarioPa = await knex.raw(
      `
      SELECT id_sumario_pa, cd_atendimento,
      (SELECT cd_item_presc FROM DBINTEGRA.DBI_FHIR_SUMARIO_PA internacao
        left JOIN dbintegra.dbi_fhir_medicamento_adm medicamento ON medicamento.cd_atendimento = internacao.cd_atendimento
      WHERE internacao.cd_atendimento = DBI_FHIR_SUMARIO_PA.CD_ATENDIMENTO
      AND ROWNUM = 1) AS MEDICAMENTO  
    FROM DBINTEGRA.DBI_FHIR_SUMARIO_PA
    WHERE sn_status = 'N'
      `
    );

    if (!findIdSumarioPa || findIdSumarioPa.length === 0) {
      console.log("### PA PROD ### Não achou nenhum registro");
      return {
        result: "ERROR",
        debug_msg: "Não encontrado registro no banco de dados",
      };
    }

    var sumarioPa = findIdSumarioPa[0];

    console.log(
      `### PA PROD ### Encontrou o atendimento = ${sumarioPa.CD_ATENDIMENTO} do Sumario ${sumarioPa.ID_SUMARIO_PA}`
    );

    const findBundle = await knex.raw(
      ` SELECT
        (SELECT CASE 
        WHEN cd_multi_empresa = 1 THEN 'HMSJ'
        WHEN cd_multi_empresa = 2 THEN 'PMP'
        WHEN cd_multi_empresa = 13 THEN 'HMSM'
        END
        FROM atendime
        WHERE cd_atendimento = DBI_FHIR_SUMARIO_PA.cd_atendimento ) ||'-'|| CD_ATENDIMENTO as ID, 
      (SELECT nm_convenio FROM convenio WHERE cd_convenio = (SELECT cd_convenio FROM dbamv.atendime WHERE cd_atendimento = DBI_FHIR_SUMARIO_PA.cd_atendimento)) NOME_CONVENIO,
      MEDICAMENTO,
      ENCAMINHAMENTO_ESPECIALIDADE,
      CATEGORIA_AGENTE,
      CODIGO_PROCEDIMENTO,
      RESULTADO_PROCEDIMENTO ,
      PRINCIPAIS_EVENTOS,
      (SELECT nr_cgc FROM convenio WHERE cd_convenio =  (SELECT cd_convenio FROM atendime WHERE cd_Atendimento = DBI_FHIR_SUMARIO_PA.cd_atendimento)) AS CNPJ
    FROM DBI_FHIR_SUMARIO_PA
    WHERE id_sumario_pa = ${sumarioPa.ID_SUMARIO_PA} `
    );

    if (!findBundle || findBundle.length === 0) {
      console.log("### PA PROD ### Não achou nenhum registro de bundle");
      return {
        result: "ERROR",
        debug_msg: "Não encontrado registro no banco de dados",
      };
    }

    var bundle = findBundle[0];

    const result = {
      resourceType: "Bundle",
      id: bundle.ID,
      type: "document",
      identifier: {
        system: "CONVENIO",
        value: `${bundle.CNPJ}`,
      },
      entry: [],
    };
    result.entry.push(
      await findResourceComposition.execute(sumarioPa.ID_SUMARIO_PA)
    );
    result.entry.push(
      await findResourceLocations.execute(sumarioPa.ID_SUMARIO_PA, cns_uid)
    );
    result.entry.push(
      await findResourceOrganization.execute(sumarioPa.ID_SUMARIO_PA)
    );
    result.entry.push(
      await findResourcePractitioner.execute(sumarioPa.ID_SUMARIO_PA, crm_uid)
    );
    result.entry.push(
      await findResourcePractitionerHigh.execute(sumarioPa.ID_SUMARIO_PA)
    );
    result.entry.push(
      await findResourceRelatedPerson.execute(sumarioPa.ID_SUMARIO_PA)
    );

    result.entry.push(
      await findResourcePatient.execute(sumarioPa.ID_SUMARIO_PA, cpf_uid)
    );

    if (sumarioPa.CATEGORIA_AGENTE) {
      result.entry.push(
        await findResourceAllergyIntolerance.execute(sumarioPa.ID_SUMARIO_PA)
      );
    }

    result.entry.push(
      await findResourceCondition.execute(sumarioPa.ID_SUMARIO_PA)
    );

    result.entry.push(
      await findResourceCondition2.execute(sumarioPa.ID_SUMARIO_PA)
    );

    if (sumarioPa.PRINCIPAIS_EVENTOS) {
      result.entry.push(
        await findResourceEpisodeOfCare.execute(sumarioPa.ID_SUMARIO_PA)
      );
    }

    result.entry.push(
      await findResourceEncounter.execute(sumarioPa.ID_SUMARIO_PA)
    );

    if (sumarioPa.CODIGO_PROCEDIMENTO && sumarioPa.RESULTADO_PROCEDIMENTO) {
      result.entry.push(
        await findResourceProcedure.execute(sumarioPa.ID_SUMARIO_PA)
      );
    }

    console.log("### PA PROD ### medicamento");
    console.log(sumarioPa.MEDICAMENTO);

    if (sumarioPa.MEDICAMENTO) {
      console.log("### PA PROD ### tem medicamento");

      result.entry.push(
        ...(await findResourceMedicationAdministration.execute(
          sumarioPa.CD_ATENDIMENTO
        ))
      );
    }

    result.entry.push(
      await findResourceRiskAssessment.execute(sumarioPa.ID_SUMARIO_PA)
    );

    result.entry.push(
      await findResourceObservation.execute(sumarioPa.ID_SUMARIO_PA)
    );

    result.entry.push(
      await findResourceObservation2.execute(sumarioPa.ID_SUMARIO_PA)
    );

    if (sumarioPa.ENCAMINHAMENTO_ESPECIALIDADE) {
      result.entry.push(
        await findRecourceCarePlan.execute(sumarioPa.ID_SUMARIO_PA)
      );
    }
    await knex.raw(
      `UPDATE DBINTEGRA.DBI_FHIR_SUMARIO_PA 
          SET sn_status = 'S' 
      WHERE id_sumario_pa = ${sumarioPa.ID_SUMARIO_PA} `
    );

    const response = await axios.put(`${URL_SANTA_JOANA}${bundle.ID}`, result, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("### PA PROD ### Envio PUT -> ", response.status);

    console.log("### PA PROD ### PROCESSO ENCERRADO ###");

    return result;
  } catch (error) {
    return console.log(error);
  }
}
