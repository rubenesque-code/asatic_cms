import axios from "axios";

import {
  // FRONTEND_DEPLOY_HOOK,
  AUTH_KEY,
  FRONTEND_PROJECT_ID,
  FRONTEND_DEPLOY_HOOK_KEY,
} from "^constants/vercel";

export const fetchLatestDeploy = async () => {
  try {
    const res = await axios.get(
      `https://api.vercel.com/v9/projects/${FRONTEND_PROJECT_ID}`,
      {
        headers,
      }
    );
    return res.data.latestDeployments[0];
  } catch (error) {
    return error;
  }
};

export const createDeploy = async () => {
  try {
    const res = await axios.post(
      `https://api.vercel.com/v1/integrations/deploy/${FRONTEND_PROJECT_ID}/${FRONTEND_DEPLOY_HOOK_KEY}`
    );
    const data = res.data.job;
    return data;
  } catch (error) {
    return error;
  }
};

const headers = {
  Authorization: `Bearer ${AUTH_KEY}`,
};

export const cancelDeploy = async (id: string) => {
  try {
    await axios.patch(
      `https://api.vercel.com/v12/deployments/${id}/cancel`,
      {},
      {
        headers,
      }
    );
  } catch (error) {
    return error;
  }
};
