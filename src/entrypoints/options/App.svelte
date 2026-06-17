<script lang="ts">
  import { Bell, Database, Folder, UserRound } from 'lucide-svelte'
</script>

<main class="min-h-screen bg-surface-section text-text-primary">
  <section class="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-6 py-8">
    <header class="border-b border-border pb-5">
      <p class="text-[12px] font-medium uppercase text-primary">Options</p>
      <h1 class="mt-1 text-2xl font-semibold">Urlala 설정</h1>
      <p class="mt-2 text-sm text-text-secondary">
        확장 프로그램 옵션 페이지가 어떤 느낌인지 확인하기 위한 더미 화면입니다.
      </p>
    </header>

    <div class="grid gap-3 py-6 sm:grid-cols-2">
      <article class="rounded-lg border border-border bg-surface p-4">
        <UserRound size="20px" class="text-primary" />
        <h2 class="mt-3 text-sm font-semibold">계정</h2>
        <p class="mt-1 text-[13px] leading-5 text-text-secondary">
          로그인 상태, 사용자 이름, 동기화 계정을 배치할 수 있습니다.
        </p>
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

    <form class="mt-auto rounded-lg border border-border bg-surface p-4">
      <label class="block text-sm font-semibold" for="dummy-api-key">
        더미 설정 입력
      </label>
      <div class="mt-3 flex gap-2">
        <input
          id="dummy-api-key"
          class="h-10 min-w-0 flex-1 rounded-md border border-border bg-surface-section px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          placeholder="예: 기본 저장 폴더명"
        />
        <button
          type="button"
          class="h-10 rounded-full bg-primary px-4 text-sm font-medium text-white"
        >
          저장
        </button>
      </div>
    </form>
  </section>
</main>
