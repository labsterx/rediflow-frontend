<template>

  <v-app-bar
    color="white"
    elevation="1"
  >
    <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

    <img src="/images/logo.png" style="height: 40px; width: auto; margin: 8px" />

    <v-spacer></v-spacer>

    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn variant="plain" :to="{name: 'PublicHome'}" prepend-icon="mdi-home-outline">Home</v-btn>
    </v-toolbar-items>

    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn variant="plain" :to="{name: 'About'}" prepend-icon="mdi-information-outline">About</v-btn>
    </v-toolbar-items>

    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn variant="plain" :to="{name: 'Login'}" prepend-icon="mdi-login-variant">Sign in</v-btn>
    </v-toolbar-items>    

  </v-app-bar>

  <v-navigation-drawer
    v-model="drawer"
    absolute
    temporary
  >


    <v-divider></v-divider>

    <v-list
      :lines="false"
      nav
      color="transparent"
    >
      <v-list-item
        v-for="(item, i) in drawerItems"
        :key="i"
        :value="item"
        :to="item.link"
        active-color="default"
      >
        <template v-slot:prepend>
          <v-icon :icon="item.icon"></v-icon>
        </template>

        <v-list-item-title v-text="item.text"></v-list-item-title>

      </v-list-item>
    </v-list>

  </v-navigation-drawer>


</template>

<script>
  export default {
    data: () => ({
      drawer: false,
      group: null,
      drawerItems: [
        { text: 'Home', icon: 'mdi-home-outline', link: {name: "PublicHome"} },
        { text: 'About', icon: 'mdi-information-outline', link: {name: "About"} },
        { text: 'Sign in', icon: 'mdi-login-variant', link: {name: "Login"} },
      ],
    }),

    watch: {
      group () {
        this.drawer = false
      },
    },
  }
</script>

<style scoped>

</style>
