
const API_URL = 'http://188.225.44.153:5700/api/1/manager/workers'

export default async (req, res) => {
  console.log(req);
  try {
      const response = await fetch(API_URL, {
          method: req.method,
          headers: {
              ...req.headers,
              'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: req.method === 'POST' ? JSON.stringify(req.body) : null,
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
