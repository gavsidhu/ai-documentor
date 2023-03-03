<script>
  import supabase from "$lib/supabaseClient";


  

  async function handleClick() {
    const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: "http://127.0.0.1:5173/success"
    }
  })
  return data
	}

    async function signout() {
  const { error } = await supabase.auth.signOut()
}
    
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<button on:click={handleClick}>Sign in with Github</button>
<button on:click={signout}>Sign Out</button>