export const routingV1 = {
  HEALTH_CHECK: "/",
  // everything above this line would not be prefixed with `PREFIX` below
  PREFIX: "/public-api/v1",
  // everything below this line would be prefixed with `PREFIX` above
  DOCS: "/docs",
  ACCOUNT: {
    REGISTER: {
      WITH_PASSWORD: "/register/with-password",
    },
  },
};
