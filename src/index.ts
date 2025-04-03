import app from './app';
import config from 'config';

const serverPort = config.get('PORT') || 2711;

app.listen(serverPort, () => {
  console.log(
    `🚀 Server is up and running at http://localhost:${serverPort}. Access it to start using the application.`
  );
});
