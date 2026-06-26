<script lang="ts">
	import ModalInit from '@/components/ModalInit.svelte'
	import UIDropdown from '@/components/UIDropdown.svelte'
	import { URLALA_BASE_URL } from '@/const'
	import { m } from '@/lib/paraglide/messages'
	import { authStore } from '@/stores/auth.svelte'
	import {
		AppWindow as IconAppWindow,
		Check as IconCheck,
		ChevronRight as IconChevronRight,
		Database as IconDatabase,
		House as IconHouse,
		Languages as IconLanguages,
		Library as IconLibrary,
		LogIn as IconLogIn,
		LogOut as IconLogOut,
		MessageSquareMore as IconMessageSquareMore,
		MonitorSmartphone as IconMonitorSmartphone,
		Smartphone as IconSmartPhone,
		SunMoon as IconSunMoon,
		Trash as IconTrash,
		UserPen as IconUserPen,
		UserRound as IconUserRound,
		UserX as IconUserX
	} from 'lucide-svelte'
	import { onMount } from 'svelte'

	let isShowInitModal = $state(false)

	const browerMessageHandler = (message: { type: string }) => {
		if (message?.type === 'AUTH_SUCCESS') authStore.load()
	}

	const moveToUrlala = async (next?: string) => {
		const accessToken = await authStore.getValidAccessToken()

		const url = accessToken
			? `${URLALA_BASE_URL}/external/login/token?accessToken=${encodeURIComponent(accessToken)}&next=${next}`
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
	{#if isShowInitModal}
		<ModalInit close={() => (isShowInitModal = false)} />
	{/if}
	<section class="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-6 py-8">
		<header>
			<h1 class="text-2xl font-semibold">{m.Settings()}</h1>
		</header>
		<div>
			<article class="border-b border-border py-6">
				<p class="text-primary font-bold text-[13px] flex items-center gap-1 mb-4">
					<IconUserRound size="16px" strokeWidth="2" />
					{m.Account()}
				</p>
				<div class="flex flex-col gap-4">
					<div class="flex items-center gap-3">
						{#if authStore.user}
							<div class="flex items-center flex-1 gap-2">
								<img
									src={authStore.profileImage}
									alt={m.Profile()}
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
								title={m.Logout()}
								onclick={logout}
							>
								<span class="text-[13px]">{m.Logout()}</span>
								<IconLogOut size="13px" />
							</button>
						{:else}
							<div class="flex items-center flex-1 gap-2">
								<div
									class="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary"
								>
									<IconUserRound size="18px" />
								</div>
								<p class="truncate text-text-secondary">{m.Guest()}</p>
							</div>
							<button
								type="button"
								class="shrink-0 text-text-secondary flex items-center gap-2"
								title={m.Logout()}
								onclick={login}
							>
								<span class="text-[13px]">{m.Login()}</span>
								<IconLogIn size="13px" />
							</button>
						{/if}
					</div>
					{#if authStore.isLoggedIn}
						<div class="flex items-center gap-3">
							<div class="flex items-center flex-1 gap-2">
								<IconUserPen size="18px" />
								<p class="truncate text-[14px]">{m.ChangeProfile()}</p>
							</div>
							<button
								type="button"
								class="shrink-0 text-text-secondary flex items-center gap-1"
								title={m.Logout()}
								onclick={() => moveToUrlala('/settings/profile')}
							>
								<span class="text-[13px]">{m.Change()}</span>
								<IconChevronRight size="13px" />
							</button>
						</div>
						<div class="flex items-center gap-3">
							<div class="flex items-center flex-1 gap-2 text-red-500">
								<IconUserX size="18px" />
								<p class="truncate text-[14px]">{m.WithdrawMembership()}</p>
							</div>
							<button
								type="button"
								class="shrink-0 text-text-secondary flex items-center gap-1"
								title={m.WithdrawBtn()}
								onclick={() => moveToUrlala('/leave')}
							>
								<span class="text-[13px]">{m.WithdrawBtn()}</span>
								<IconChevronRight size="13px" />
							</button>
						</div>
					{/if}
				</div>
			</article>
			<article class="border-b border-border py-6">
				<p class="text-primary font-bold text-[13px] flex items-center gap-1 mb-4">
					<IconAppWindow size="16px" strokeWidth="2" />
					{m.DisplaySettings()}
				</p>
				<div class="flex flex-col gap-4">
					<div class="flex items-center gap-3">
						<div class="flex items-center flex-1 gap-2 text-text-secondary">
							<IconLanguages size="18px" />
							<p class="truncate text-[14px]">{m.Language()}</p>
						</div>
						<UIDropdown id="language">
							{#snippet trigger()}
								<button
									type="button"
									class="text-[13px] text-text-secondary flex items-center gap-1"
									disabled
								>
									{m.System()}
								</button>
							{/snippet}
							{#snippet menus()}
								<button
									type="button"
									class="gap-2 px-2 py-1.5 flex w-full items-center justify-between text-left text-[12px] text-text-primary"
								>
									<span class="whitespace-nowrap">{m.System()}</span>
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
							<p class="truncate text-[14px]">{m.Theme()}</p>
						</div>
						<UIDropdown id="theme">
							{#snippet trigger()}
								<button
									type="button"
									class="text-[13px] text-text-secondary flex items-center gap-1"
									disabled
								>
									{m.System()}
								</button>
							{/snippet}
							{#snippet menus()}
								<button
									type="button"
									class="gap-2 px-2 py-1.5 flex w-full items-center justify-between text-left text-[12px] text-text-primary"
								>
									<span class="whitespace-nowrap">{m.System()}</span>
									{#if true}
										<IconCheck size="13px" color="var(--color-primary)" />
									{/if}
								</button>
								<button
									type="button"
									class="gap-2 px-2 py-1.5 flex w-full items-center justify-between text-left text-[12px] text-text-secondary"
								>
									<span class="whitespace-nowrap">{m.Light()}</span>
									{#if false}
										<IconCheck size="13px" color="var(--color-primary)" />
									{/if}
								</button>
								<button
									type="button"
									class="gap-2 px-2 py-1.5 flex w-full items-center justify-between text-left text-[12px] text-text-secondary"
								>
									<span class="whitespace-nowrap">{m.Dark()}</span>
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
						{m.DataSettings()}
					</p>
					<div class="flex flex-col gap-4">
						<div class="flex items-center gap-3">
							<div class="flex items-center flex-1 gap-2 text-text-secondary">
								<IconTrash size="18px" />
								<p class="truncate text-[14px]">{m.DataReset()}</p>
							</div>
							<button
								type="button"
								class="shrink-0 text-red-500 flex items-center border border-red-500 rounded-full py-0.5 px-1.5"
								title={m.Reset()}
								onclick={() => (isShowInitModal = true)}
							>
								<span class="text-[12px] font-bold">{m.Reset()}</span>
							</button>
						</div>
					</div>
				</article>
			{/if}
			<article class="border-b border-border py-6">
				<p class="text-primary font-bold text-[13px] flex items-center gap-1 mb-4">
					<IconMonitorSmartphone size="16px" strokeWidth="2" />
					{m.AppInfo()}
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
							title={m.GoTo()}
							onclick={() => moveToUrlala('/')}
						>
							<span class="text-[13px]">{m.GoTo()}</span>
							<IconChevronRight size="13px" />
						</button>
					</div>
					{#if false}
						<div class="flex items-center gap-3">
							<div class="flex items-center flex-1 gap-2 text-text-secondary">
								<IconSmartPhone size="18px" />
								<p class="truncate">{m.AppInfo()}</p>
							</div>
							<button
								type="button"
								class="shrink-0 text-text-secondary flex items-center gap-1"
								title={m.Logout()}
								onclick={login}
							>
								<span class="text-[13px]">{m.GoTo()}</span>
								<IconChevronRight size="13px" />
							</button>
						</div>
					{/if}
					<div class="flex items-center gap-3">
						<div class="flex items-center flex-1 gap-2 text-text-secondary">
							<IconLibrary size="18px" />
							<p class="truncate text-[14px]">{m.UserGuide()}</p>
						</div>
						<button
							type="button"
							class="shrink-0 text-text-secondary flex items-center gap-1"
							title={m.ViewGuide()}
							onclick={() => moveToUrlala('/guides')}
						>
							<span class="text-[13px]">{m.ViewGuide()}</span>
							<IconChevronRight size="13px" />
						</button>
					</div>
					<div class="flex items-center gap-3">
						<div class="flex items-center flex-1 gap-2 text-text-secondary">
							<IconMessageSquareMore size="18px" />
							<p class="truncate text-[14px]">{m.Contact()}</p>
						</div>
						<button
							type="button"
							class="shrink-0 text-text-secondary flex items-center gap-1"
							title={m.ViewGuide()}
							onclick={() => moveToUrlala('/contact')}
						>
							<span class="text-[13px]">{m.GoTo()}</span>
							<IconChevronRight size="13px" />
						</button>
					</div>
				</div>
			</article>
		</div>
		<div class="mt-4">
			<div class="flex items-center justify-center gap-2 text-[12px]">
				<a href={`${URLALA_BASE_URL}/terms`}>{m.Privacy()}</a>
				<a href={`${URLALA_BASE_URL}/privacy`}>{m.TermsOfService()}</a>
			</div>
			<p class="text-text-secondary text-center text-[11px]">Urala Extension 1.0.0</p>
		</div>
	</section>
</main>
