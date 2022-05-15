'use strict';

module.exports =  {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap() {
    console.log("BOOTSTRAP");
    const hasAdmin = await strapi.service('admin::user').exists();

    if (hasAdmin) {
      console.log("SUPER ADMIN EXISTS");
      return;
    }

    const superAdminRole = await strapi.service('admin::role').getSuperAdmin();

    if (!superAdminRole) {
      return;
    }

    await strapi.service('admin::user').create({
      email: 'admin@devserver.lan',
      firstname: 'admin',
      lastname: 'admin',
      password: 'admin',
      registrationToken: null,
      isActive: true,
      roles: superAdminRole ? [superAdminRole.id] : [],
    });

  },
};


