import { DOMAIN, Endpoints } from "@/shared/config/api.config"

const API_URL = DOMAIN + Endpoints.workers

const requestHandler = async (req, res) => {
  try {
      const formData = new URLSearchParams(req.body);

      const response = await fetch(API_URL, {
          method: req.method,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData.toString(),
      });

      if (!response.ok) {
          console.error(`Error fetching from backend: ${response.statusText}`);
          return res.status(response.status).json({ error: 'Failed to fetch from backend' });
      }

      const data = await response.json();
      res.status(200).json(data);

  } catch (error) {
      console.error('Internal Server Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default requestHandler