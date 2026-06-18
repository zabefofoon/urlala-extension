<script lang="ts">
  import { onMount } from 'svelte'
  import { Bell, Database, Folder, LogOut, UserRound } from 'lucide-svelte'
  import { authStore } from '@/stores/auth.svelte'

  const browerMessageHandler = (message: { type: string }) => {
      if (message?.type === 'AUTH_SUCCESS') authStore.load()
    }

  onMount(() => {
    authStore.load()
    browser.runtime.onMessage.addListener(browerMessageHandler)
    return () => {
      browser.runtime.onMessage.removeListener(browerMessageHandler)
    }
  })

  const logout = async () => {
    await authStore.clearTokens()
  }
</script>

<main class="min-h-screen bg-surface-section text-text-primary">
  <section class="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-6 py-8">
    <header class="border-b border-border pb-5">
      <p class="text-[12px] font-medium uppercase text-primary">Options</p>
      <h1 class="mt-1 text-2xl font-semibold">Urlala 설정</h1>
    </header>

    <div class="grid gap-3 py-6 sm:grid-cols-2">

      <!-- 계정 -->
      <article class="rounded-lg border border-border bg-surface p-4">
        <UserRound size="20px" class="text-primary" />
        <h2 class="mt-3 text-sm font-semibold">계정</h2>
        {#if !authStore.isLoaded}
          <div class="mt-3 h-10 animate-pulse rounded-md bg-surface-section"></div>
        {:else if !authStore.isLoggedIn}
          <p class="mt-2 text-[13px] text-text-secondary">로그인되지 않았습니다.</p>
        {:else}
          <div class="mt-3 flex items-center gap-3">
            {#if authStore.user?.user_metadata?.avatar_url}
              <img
                src={authStore.user.user_metadata.avatar_url}
                alt="프로필"
                class="h-9 w-9 rounded-full object-cover"
              />
            {:else}
              <div class="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UserRound size="18px" />
              </div>
            {/if}
            <div class="min-w-0 flex-1">
              {#if authStore.user?.user_metadata?.full_name}
                <p class="truncate text-[13px] font-medium">
                  {authStore.user.user_metadata.full_name}
                </p>
              {/if}
              <p class="truncate text-[12px] text-text-secondary">{authStore.user?.email}</p>
            </div>
            <button
              type="button"
              class="shrink-0 text-text-secondary hover:text-red-500 transition-colors"
              title="로그아웃"
              onclick={logout}
            >
              <LogOut size="16px" />
            </button>
          </div>
        {/if}
      </article>

      <article class="rounded-lg border border-border bg-surface p-4">
        <Folder size="20px" class="text-primary" />
        <h2 class="mt-3 text-sm font-semibold">폴더 기본값</h2>
        <p class="mt-1 text-[13px] leading-5 text-text-secondary">
          새 URL을 저장할 기본 폴더나 정렬 기준을 둘 수 있습니다.
        </p>
      </article>

      <article class="rounded-lg border border-border bg-surface p-4">
        <Bell size="20px" class="text-primary" />
        <h2 class="mt-3 text-sm font-semibold">알림</h2>
        <p class="mt-1 text-[13px] leading-5 text-text-secondary">
          저장 완료, 실패, 중복 URL 안내 같은 알림 옵션 자리입니다.
        </p>
      </article>

      <article class="rounded-lg border border-border bg-surface p-4">
        <Database size="20px" class="text-primary" />
        <h2 class="mt-3 text-sm font-semibold">데이터</h2>
        <p class="mt-1 text-[13px] leading-5 text-text-secondary">
          내보내기, 가져오기, Supabase 동기화 설정을 둘 수 있습니다.
        </p>
      </article>
    </div>
  </section>
</main>
