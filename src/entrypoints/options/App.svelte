<script lang="ts">
	import UIDropdown from '@/components/UIDropdown.svelte'
	import { URLALA_BASE_URL } from '@/const'
	import { authStore } from '@/stores/auth.svelte'
	import {
		AppWindow as IconAppWindow,
		Check as IconCheck,
		ChevronDown as IconChevronDown,
		ChevronRight as IconChevronRight,
		Database as IconDatabase,
		House as IconHouse,
		Languages as IconLanguages,
		Library as IconLibrary,
		LogIn as IconLogIn,
		LogOut as IconLogOut,
		MonitorSmartphone as IconMonitorSmartphone,
		Smartphone as IconSmartPhone,
		SunMoon as IconSunMoon,
		Trash as IconTrash,
		UserPen as IconUserPen,
		UserRound as IconUserRound,
		UserX as IconUserX
	} from 'lucide-svelte'
	import { onMount } from 'svelte'

	const browerMessageHandler = (message: { type: string }) => {
		if (message?.type === 'AUTH_SUCCESS') authStore.load()
	}

	const moveToUrlala = async (next?: string) => {
		const { accessToken } = await browser.storage.local.get(['accessToken'])

		const url = accessToken
			? `${URLALA_BASE_URL}/external/login/token?accessToken=${encodeURIComponent(accessToken as string)}&next=${next}`
			: `${URLALA_BASE_URL}?next=${next}`

		browser.tabs.create({ url })
		window.close()
	}

	const login = () => {
		browser.tabs.create({ url: `${URLALA_BASE_URL}/external/login?from=extension` })
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
		<header>
			<h1 class="text-2xl font-semibold">Urlala 설정</h1>
		</header>
		<div>
			<article class="border-b border-border py-6">
				<p class="text-primary font-bold text-[13px] flex items-center gap-1 mb-4">
					<IconUserRound size="16px" strokeWidth="2" />
					계정
				</p>
				<div class="flex flex-col gap-4">
					<div class="flex items-center gap-3">
						{#if authStore.user}
							<div class="flex items-center flex-1 gap-2">
								<img
									src={authStore.user.user_metadata.avatar_url}
									alt="프로필"
									class="h-9 w-9 rounded-full object-cover"
								/>
								<div>
									<p class="truncate font-medium text-[15px]">
										{authStore.user.user_metadata.full_name}
									</p>
									<p class="truncate text-[12px] text-text-secondary">{authStore.user?.email}</p>
								</div>
							</div>
							<button
								type="button"
								class="shrink-0 text-text-secondary flex items-center gap-2"
								title="로그아웃"
								onclick={logout}
							>
								<span class="text-[13px]">로그아웃</span>
								<IconLogOut size="13px" />
							</button>
						{:else}
							<div class="flex items-center flex-1 gap-2">
								<div
									class="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary"
								>
									<IconUserRound size="18px" />
								</div>
								<p class="truncate text-text-secondary">게스트</p>
							</div>
							<button
								type="button"
								class="shrink-0 text-text-secondary flex items-center gap-2"
								title="로그아웃"
								onclick={login}
							>
								<span class="text-[13px]">로그인</span>
								<IconLogIn size="13px" />
							</button>
						{/if}
					</div>
					{#if authStore.isLoggedIn}
						<div class="flex items-center gap-3">
							<div class="flex items-center flex-1 gap-2">
								<IconUserPen size="18px" />
								<p class="truncate text-[14px]">프로필 변경</p>
							</div>
							<button
								type="button"
								class="shrink-0 text-text-secondary flex items-center gap-1"
								title="로그아웃"
								onclick={() => moveToUrlala('/settings/profile')}
							>
								<span class="text-[13px]">변경하기</span>
								<IconChevronRight size="13px" />
							</button>
						</div>
						<div class="flex items-center gap-3">
							<div class="flex items-center flex-1 gap-2 text-red-500">
								<IconUserX size="18px" />
								<p class="truncate text-[14px]">회원탈퇴</p>
							</div>
							<button
								type="button"
								class="shrink-0 text-text-secondary flex items-center gap-1"
								title="탈퇴하기"
								onclick={() => moveToUrlala('/leave')}
							>
								<span class="text-[13px]">탈퇴하기</span>
								<IconChevronRight size="13px" />
							</button>
						</div>
					{/if}
				</div>
			</article>
			<article class="border-b border-border py-6">
				<p class="text-primary font-bold text-[13px] flex items-center gap-1 mb-4">
					<IconAppWindow size="16px" strokeWidth="2" />
					화면 설정
				</p>
				<div class="flex flex-col gap-4">
					<div class="flex items-center gap-3">
						<div class="flex items-center flex-1 gap-2 text-text-secondary">
							<IconLanguages size="18px" />
							<p class="truncate text-[14px]">언어</p>
						</div>
						<UIDropdown id="language">
							{#snippet trigger()}
								<button
									type="button"
									class="text-[13px] text-text-secondary flex items-center gap-1"
								>
									시스템
									<IconChevronDown size="12px" />
								</button>
							{/snippet}
							{#snippet menus()}
								<button
									type="button"
									class="gap-2 px-2 py-1.5 flex w-full items-center justify-between text-left text-[12px] text-text-primary"
								>
									<span class="whitespace-nowrap">시스템</span>
									{#if true}
										<IconCheck size="13px" color="var(--color-primary)" />
									{/if}
								</button>
								<button
									type="button"
									class="gap-2 px-2 py-1.5 flex w-full items-center justify-between text-left text-[12px] text-text-secondary"
								>
									<span class="whitespace-nowrap">English</span>
									{#if false}
										<IconCheck size="13px" color="var(--color-primary)" />
									{/if}
								</button>
								<button
									type="button"
									class="gap-2 px-2 py-1.5 flex w-full items-center justify-between text-left text-[12px] text-text-secondary"
								>
									<span class="whitespace-nowrap">한국어</span>
									{#if false}
										<IconCheck size="13px" color="var(--color-primary)" />
									{/if}
								</button>
							{/snippet}
						</UIDropdown>
					</div>
					<div class="flex items-center gap-3">
						<div class="flex items-center flex-1 gap-2 text-text-secondary">
							<IconSunMoon size="18px" />
							<p class="truncate text-[14px]">테마</p>
						</div>
						<UIDropdown id="theme">
							{#snippet trigger()}
								<button
									type="button"
									class="text-[13px] text-text-secondary flex items-center gap-1"
								>
									시스템
									<IconChevronDown size="12px" />
								</button>
							{/snippet}
							{#snippet menus()}
								<button
									type="button"
									class="gap-2 px-2 py-1.5 flex w-full items-center justify-between text-left text-[12px] text-text-primary"
								>
									<span class="whitespace-nowrap">시스템</span>
									{#if true}
										<IconCheck size="13px" color="var(--color-primary)" />
									{/if}
								</button>
								<button
									type="button"
									class="gap-2 px-2 py-1.5 flex w-full items-center justify-between text-left text-[12px] text-text-secondary"
								>
									<span class="whitespace-nowrap">라이트</span>
									{#if false}
										<IconCheck size="13px" color="var(--color-primary)" />
									{/if}
								</button>
								<button
									type="button"
									class="gap-2 px-2 py-1.5 flex w-full items-center justify-between text-left text-[12px] text-text-secondary"
								>
									<span class="whitespace-nowrap">다크</span>
									{#if false}
										<IconCheck size="13px" color="var(--color-primary)" />
									{/if}
								</button>
							{/snippet}
						</UIDropdown>
					</div>
				</div>
			</article>
			{#if !authStore.isLoggedIn}
				<article class="border-b border-border py-6">
					<p class="text-primary font-bold text-[13px] flex items-center gap-1 mb-4">
						<IconDatabase size="16px" strokeWidth="2" />
						데이터 설정
					</p>
					<div class="flex flex-col gap-4">
						<div class="flex items-center gap-3">
							<div class="flex items-center flex-1 gap-2 text-text-secondary">
								<IconTrash size="18px" />
								<p class="truncate text-[14px]">데이터 초기화</p>
							</div>
							<button
								type="button"
								class="shrink-0 text-red-500 flex items-center border border-red-500 rounded-full py-0.5 px-1.5"
								title="초기화"
							>
								<span class="text-[12px] font-bold">초기화</span>
							</button>
						</div>
					</div>
				</article>
			{/if}
			<article class="border-b border-border py-6">
				<p class="text-primary font-bold text-[13px] flex items-center gap-1 mb-4">
					<IconMonitorSmartphone size="16px" strokeWidth="2" />
					앱 정보
				</p>
				<div class="flex flex-col gap-4">
					<div class="flex items-center gap-3">
						<div class="flex items-center flex-1 gap-2 text-text-secondary">
							<IconHouse size="18px" />
							<p class="truncate text-[14px]">Urlala</p>
						</div>
						<button
							type="button"
							class="shrink-0 text-text-secondary flex items-center gap-1"
							title="이동하기"
							onclick={() => moveToUrlala('/')}
						>
							<span class="text-[13px]">이동하기</span>
							<IconChevronRight size="13px" />
						</button>
					</div>
					{#if false}
						<div class="flex items-center gap-3">
							<div class="flex items-center flex-1 gap-2 text-text-secondary">
								<IconSmartPhone size="18px" />
								<p class="truncate">앱 다운로드</p>
							</div>
							<button
								type="button"
								class="shrink-0 text-text-secondary flex items-center gap-1"
								title="로그아웃"
								onclick={login}
							>
								<span class="text-[13px]">이동하기</span>
								<IconChevronRight size="13px" />
							</button>
						</div>
					{/if}
					<div class="flex items-center gap-3">
						<div class="flex items-center flex-1 gap-2 text-text-secondary">
							<IconLibrary size="18px" />
							<p class="truncate text-[14px]">이용가이드</p>
						</div>
						<button
							type="button"
							class="shrink-0 text-text-secondary flex items-center gap-1"
							title="보러가기"
							onclick={() => moveToUrlala('/guides')}
						>
							<span class="text-[13px]">보러가기</span>
							<IconChevronRight size="13px" />
						</button>
					</div>
				</div>
			</article>
		</div>
		<div class="mt-4">
			<div class="flex items-center justify-center gap-2 text-[12px]">
				<a>개인정보처리</a>
				<a>이용약관</a>
			</div>
			<p class="text-text-secondary text-center text-[11px]">Urala Extension 1.0.0</p>
		</div>
	</section>
</main>
