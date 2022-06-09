module.exports = {
  apps : [{
    name: 'registry-backend',
    instances: 1,
    autorestart: true,
script: 'npm',
args: 'start',

    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],
};
