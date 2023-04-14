<template>

  <v-app-bar
    color="white"
    elevation="1"
  >
    <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

    <img src="/images/logo.png" style="height: 40px; width: auto; margin: 8px" />

    <v-spacer></v-spacer>

    <div style="max-width:400px">
      <NetworkSwitchBtn 
        :supportedNetworks="config.supportedNetworks"
        :localStorageKeyForLogin="config.localStorageKey.login"
        :logOutRedirectRoute="config.defaultRedirect.login"
      />
    </div>

    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn variant="plain" :to="{name: 'AppHome'}" prepend-icon="mdi-home-outline">Home</v-btn>
    </v-toolbar-items>
    
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn icon="mdi-account-circle" v-bind="props"></v-btn>
      </template>

      <v-list>
        <v-list-item :to="{name: 'UserDefault'}">
          <v-list-item-title>My Acccount</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{name: 'Logout'}">
          <v-list-item-title>Sign out</v-list-item-title>
        </v-list-item>        
      </v-list>
    </v-menu>

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
import NetworkSwitchBtn from '@/components/ui/NetworkSwitchBtn.vue'
import { config } from '@/config/index.js'
export default {
  data: () => ({
    config: config,
    drawer: false,
    group: null,
    drawerItems: [
      { text: 'Home', icon: 'mdi-home-outline', link: {name: "AppHome"} },
      { text: 'My Account', icon: 'mdi-information-outline', link: {name: "UserDefault"} },
      { text: 'Sign Out', icon: 'mdi-logout-variant', link: {name: "Logout"} },
    ],
  }),
  components: {
    NetworkSwitchBtn,
  },  
  watch: {
    group () {
      this.drawer = false
    },
  },
}
</script>

<style scoped>

</style>
