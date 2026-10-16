<script setup lang="ts">
const {data: projects} = await useAsyncData('home-projects', () =>
	queryCollection('projects').select(...PROJECT_CARD_FIELDS).order('date', 'DESC').limit(6).all()
)
const {data: articles} = await useAsyncData('home-articles', () =>
	queryCollection('articles').select('path', 'title', 'description', 'date', 'image', 'author').order('date', 'DESC').limit(3).all()
)

const disciplines = [
	{title: 'Full-stack Web', description: 'Nuxt, Vue and TypeScript apps, from SSR sites to self-hosted tooling.', icon: 'i-lucide-layers'},
	{title: 'Desktop Apps', description: 'Small, fast Tauri v2 utilities and editors that feel native.', icon: 'i-lucide-cpu'},
	{title: 'Game Dev & Design', description: 'Unity libraries, Minecraft mods and the systems behind them.', icon: 'i-lucide-gamepad-2'},
	{title: 'Libraries & DX', description: 'Parsers, ORMs, dispatchers and CLIs we wished already existed.', icon: 'i-lucide-terminal'},
	{title: 'DevOps & IoT', description: 'Docker pipelines, CI/CD and the occasional microcontroller.', icon: 'i-lucide-server-cog'},
	{title: 'UI / UX', description: 'Interfaces and brand art, including everything you see here.', icon: 'i-lucide-palette'}
]

const stack = ['nuxt', 'vuedotjs', 'typescript', 'tauri', 'rust', 'dotnet', 'unity', 'tailwindcss', 'sqlite', 'docker', 'obsidian', 'markdown']
</script>

<template>
	<div>
		<!-- Hero: V2 artwork as backdrop -->
		<section class="relative isolate overflow-hidden bg-black text-white border-b border-default">
			<img
				src="/wallpapers/[V2] CTRL Neo - Ascii Singularity - Light Text.png"
				alt=""
				class="absolute inset-0 -z-10 size-full object-cover"
				fetchpriority="high"
			>
			<div class="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-black/20 to-black"/>
			<UContainer class="flex min-h-[calc(100svh-var(--ui-header-height))] flex-col items-center justify-end gap-6 pb-20 pt-[55svh] text-center">
				<h1 class="font-display text-4xl sm:text-6xl font-medium tracking-tighter text-balance">
					Computer science, <span class="text-primary">built in the open.</span>
				</h1>
				<p class="max-w-xl text-lg text-white/70 text-balance">
					CTRL Neo is a small, student-run studio building tools, libraries, apps and games.
				</p>
				<div class="flex flex-wrap justify-center gap-3">
					<UButton label="Explore projects" to="/projects" size="lg" trailing-icon="i-lucide-arrow-right"/>
					<UButton
						label="GitHub"
						:to="GITHUB_ORG"
						target="_blank"
						icon="i-simple-icons-github"
						size="lg"
						color="neutral"
						variant="outline"
						class="bg-transparent text-white ring-white/30 hover:bg-white/10"
					/>
				</div>
			</UContainer>
		</section>

		<!-- Stack marquee -->
		<UMarquee pause-on-hover class="border-b border-default py-6" :ui="{ root: '[--gap:--spacing(16)]' }">
			<UIcon v-for="icon in stack" :key="icon" :name="`i-simple-icons-${icon}`" class="size-8 shrink-0 text-muted"/>
		</UMarquee>

		<!-- Featured projects -->
		<UPageSection
			headline="Work"
			title="Latest projects"
			description="Libraries, editors and apps we're shipping right now."
			:links="[{ label: 'All projects', to: '/projects', color: 'neutral', variant: 'outline', trailingIcon: 'i-lucide-arrow-right' }]"
		>
			<ProjectGrid :projects="projects ?? []"/>
		</UPageSection>

		<USeparator/>

		<!-- Disciplines -->
		<UPageSection
			headline="What we do"
			title="Curiosity-driven, utilitarian by design"
			description="We pick up new frameworks to build things people actually use. We're not professionals yet; we're students learning how to be."
			:features="disciplines"
		/>

		<!-- Artwork band -->
		<section class="border-y border-default bg-black">
			<UCarousel
				v-slot="{ item }"
				:items="artworks"
				loop
				:auto-scroll="{ speed: 0.6 }"
				drag-free
				:ui="{ item: 'basis-4/5 sm:basis-1/2 lg:basis-1/3 ps-0', container: 'ms-0' }"
			>
				<figure class="relative aspect-video">
					<img :src="item.src" :alt="item.title" loading="lazy" class="size-full object-cover">
					<figcaption class="absolute bottom-3 left-4 font-mono text-xs text-white/60">{{ item.title }}</figcaption>
				</figure>
			</UCarousel>
		</section>

		<!-- Articles -->
		<UPageSection
			v-if="articles?.length"
			headline="Writing"
			title="From the studio"
			:links="[{ label: 'All articles', to: '/articles', color: 'neutral', variant: 'outline', trailingIcon: 'i-lucide-arrow-right' }]"
		>
			<UBlogPosts>
				<UBlogPost
					v-for="article in articles"
					:key="article.path"
					:title="article.title"
					:description="article.description"
					:date="formatDate(article.date)"
					:image="article.image ?? fallbackArt(article.path)"
					:authors="[{ name: article.author, avatar: { src: `https://github.com/${article.author}.png` } }]"
					:to="article.path"
					variant="outline"
				/>
			</UBlogPosts>
		</UPageSection>

		<!-- CTA -->
		<UPageSection>
			<UPageCTA
				title="Open source, open doors"
				description="Issues, pull requests, ideas: every contribution is credited in our READMEs or our code."
				variant="subtle"
				:links="[
					{ label: 'Contribute on GitHub', to: GITHUB_ORG, target: '_blank', icon: 'i-lucide-git-pull-request' },
					{ label: 'Meet the team', to: '/articles/about-us', color: 'neutral', variant: 'outline' }
				]"
				class="bg-grid"
			/>
		</UPageSection>
	</div>
</template>
