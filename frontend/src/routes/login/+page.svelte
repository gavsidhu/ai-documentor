<script lang="ts">
  import supabase from "$lib/supabaseClient";
  import type { Provider } from "@supabase/supabase-js";
  import 'iconify-icon'
  import Icon from "@iconify/svelte"

    const providers: {providerName: Provider, icon: string}[] = [
        {providerName: 'github', icon : "mdi:github"},
        {providerName: 'google', icon : "mdi:google"},
        {providerName: 'twitter', icon : "mdi:twitter"}
    ]

    function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

    async function signInWithProvider(provider: Provider){
        await supabase.auth.signInWithOAuth({
            provider: provider
        })
    }
</script>

<div class="form-card">
    <div class="button-wrapper">
        {#each providers as provider }
            <button class="sign-in-button" on:click={() => signInWithProvider(provider.providerName)}>
                <Icon style="margin-right: 12px;" height={"24px"} width={"24px"}  icon={provider.icon}></Icon>
                Sign in with {capitalizeFirstLetter(provider.providerName)}
            </button>
        {/each}
    </div>
</div>

<style>
    .form-card {
        margin-top: 5rem;
        margin-right: auto;
        margin-left: auto;
        max-width: 40%;
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
        padding: 10px 25px 10px 25px;
    }
    .button-wrapper {
        display: flex;
        flex-direction: column;
        width: 55%;
        margin-right: auto;
        margin-left: auto;
        padding-top: 10%;
        padding-bottom: 10%;
    }
    .sign-in-button {
        display: flex;
        padding-top: 8px;
        padding-bottom: 8px;
        margin-top: 8px;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        cursor: pointer;
    }
</style>