export type RedditComment = {
	id: string;
	author: string;
	excerpt: string;
	url: string;
};

export const redditComments: RedditComment[] = [
	{
		id: 'nkuf6fw',
		author: 'JuanToronDoe',
		excerpt:
			'Arcane felt just right : beautiful, simple yet powerful, with a lot of advanced features in submenus. The auto update is also very neat. And running a distant agent was super easy.',
		url: 'https://www.reddit.com/r/selfhosted/comments/1nfekvj/release_arcane_docker_management_v100/nkuf6fw/'
	},
	{
		id: 'o5ar8wa',
		author: 'zuus',
		excerpt:
			"Arcane is so good. Love that I can edit my compose files manually through SSH if I need to and they'll update in Arcane, and the cron job container updates with dependency checking is chefs kiss. No more need for watchtower",
		url: 'https://www.reddit.com/r/selfhosted/comments/1r48ay5/anyone_else_find_portainer_isnt_all_that_great/o5ar8wa/'
	},
	{
		id: 'mrxjsi1',
		author: 'Telnetdoogie',
		excerpt: "This is immediately the best container management tool I've played with.",
		url: 'https://www.reddit.com/r/selfhosted/comments/1kf3mqr/release_arcane_docker_management_ui/mrxjsi1/'
	},
	{
		id: 'nxzyi5o',
		author: 'thehaseebahmed',
		excerpt:
			"My vote would be for Arcane! It has a beautiful UI/UX, works wonderfully on the phone and has pretty much everything that I'd expect from a tool of that sort.",
		url: 'https://www.reddit.com/r/selfhosted/comments/1q4txvu/kudos_to_dockhand_docker_management_done_right/nxzyi5o/'
	},
	{
		id: 'p94kpk2',
		author: 'AresTehGod',
		excerpt:
			'Really liked Portainer when I got into selfhosting a few years ago but switched to Arcane about a year ago liking it features and UI more as well as it being more user friendly.',
		url: 'https://www.reddit.com/r/selfhosted/comments/1wdbia2/portainer_3_coming_without_ce_pivoting_to/p94kpk2/'
	},
	{
		id: 'ndwb4ti',
		author: 'Anarchist_Future',
		excerpt:
			'I just installed it on TrueNAS and an Ubuntu Server VPS. It is now my favourite Docker manager!',
		url: 'https://www.reddit.com/r/selfhosted/comments/1nfekvj/release_arcane_docker_management_v100/ndwb4ti/'
	},
	{
		id: 'ox57y0n',
		author: 'walkention',
		excerpt:
			"Switched to this from Portainer and it's vastly better. … Overall the UI is cleaner and easier to use.",
		url: 'https://www.reddit.com/r/selfhosted/comments/1uum8fn/portainer_alternatives_what_are_you_using/ox57y0n/'
	},
	{
		id: 'o3pbaq4',
		author: 'regalen44',
		excerpt:
			'I found arcane to have a great UX and the update prompts for containers are perfect, no need for watchtower.',
		url: 'https://www.reddit.com/r/selfhosted/comments/1qwi73u/dockhand_vs_arcane_vs_komodo/o3pbaq4/'
	},
	{
		id: 'pbkfwv0',
		author: '_ararana',
		excerpt: "Now I feel like I've been missing out, Arcane is pretty damn impressive.",
		url: 'https://www.reddit.com/r/selfhosted/comments/1wnhg3b/portainer_cuts_the_cord_between_its_free_and_paid/pbkfwv0/'
	},
	{
		id: 'oe664g8',
		author: 'NerdyBirdie81',
		excerpt:
			'As for container management I use Arcane. Awesome, simple, allows use of git repos for docker compose files, handles updating when a new container update is released and handles agents that can be installed on other systems so you can manage docker containers there.',
		url: 'https://www.reddit.com/r/selfhosted/comments/1salkni/laugh_at_my_pain_and_learn_from_my_mistakes/oe664g8/'
	},
	{
		id: 'ne3pq8w',
		author: 'ichugcaffeine',
		excerpt: 'Been looking for an alternative to portainer and dockge. This is it!',
		url: 'https://www.reddit.com/r/selfhosted/comments/1nfekvj/release_arcane_docker_management_v100/ne3pq8w/'
	},
	{
		id: 'p6gbeqt',
		author: 'TJRDU',
		excerpt:
			"Went from Portainer to Arcane. Feels like i'm way more in control now. Also it's just so much faster.",
		url: 'https://www.reddit.com/r/selfhosted/comments/1w0mnlz/what_are_you_using_to_manage_docker/p6gbeqt/'
	},
	{
		id: 'pbfcp8d',
		author: '26635785548498061384',
		excerpt: "Since arcane v2 came out, I've moved back to it and can thoroughly recommend.",
		url: 'https://www.reddit.com/r/selfhosted/comments/1wnhg3b/portainer_cuts_the_cord_between_its_free_and_paid/pbfcp8d/'
	},
	{
		id: 'ox8jg8n',
		author: 'itswednesday',
		excerpt: 'I love arcane. Simple and powerful. Love the agents that run in remote clusters.',
		url: 'https://www.reddit.com/r/selfhosted/comments/1uum8fn/portainer_alternatives_what_are_you_using/ox8jg8n/'
	},
	{
		id: 'nqhg3vc',
		author: 'BigB_117',
		excerpt:
			'Just spun this up to test. Looks really impressive on first look. Great UI and fixes my main annoyances with dockge (the narrow compose editor, and no ability to see networks, images, or volumes)',
		url: 'https://www.reddit.com/r/selfhosted/comments/1nfekvj/release_arcane_docker_management_v100/nqhg3vc/'
	},
	{
		id: 'o1rg7w1',
		author: 'No_Pollution_9975',
		excerpt:
			'I would right now recommend arcane it gets better every update. And it gets a lot of updates de developer is pretty fast with it and also does a lot of feature requests.',
		url: 'https://www.reddit.com/r/selfhosted/comments/1qmo0nx/komodo_docker_management/o1rg7w1/'
	},
	{
		id: 'oxb11j6',
		author: 'Ejz9',
		excerpt:
			'I tried Arcane and like the GUI. Super clean and features work well. It works incredibly well where I manage my stacks through git.',
		url: 'https://www.reddit.com/r/selfhosted/comments/1uum8fn/portainer_alternatives_what_are_you_using/oxb11j6/'
	},
	{
		id: 'o3ragbn',
		author: 'dagrlx',
		excerpt:
			"If you're looking for something easy to manage, without many requirements, Arcane is an excellent option.",
		url: 'https://www.reddit.com/r/selfhosted/comments/1qwi73u/dockhand_vs_arcane_vs_komodo/o3ragbn/'
	},
	{
		id: 'nxv9qph',
		author: 'Prudent-Let-3959',
		excerpt:
			'…between Portainer and Arcane I would hands down recommend Arcane. It’s really easy to use and they expose REST APIs which I’ve used to set up CI/CD for my homelab with gitea.',
		url: 'https://www.reddit.com/r/selfhosted/comments/1q4txvu/kudos_to_dockhand_docker_management_done_right/nxv9qph/'
	},
	{
		id: 'p6sqj24',
		author: 'K-Zawis',
		excerpt:
			'Arcane! … I like it a lot and use it a lot more than I did portainer. Looks nicer too which is a bonus.',
		url: 'https://www.reddit.com/r/selfhosted/comments/1w1zvnz/portainer_vs_dockhand_which_one_do_you_prefer_and/p6sqj24/'
	},
	{
		id: 'o48sa97',
		author: 'Slidetest17',
		excerpt:
			'Arcane for me. Simple and full of features I actually need… I replaced Dockge+Diun+Cup with this one.',
		url: 'https://www.reddit.com/r/selfhosted/comments/1qy1fxo/dokploy_vs_komodo_vs_arcane/o48sa97/'
	},
	{
		id: 'p30fk5b',
		author: 'TetsujinXLIV',
		excerpt:
			'I switched from portainer to Arcane a few weeks ago and am very happy with the change. … UI is nice and responsive. I like the shared secrets per node or across nodes.',
		url: 'https://www.reddit.com/r/selfhosted/comments/1vlcbfi/comparing_8_docker_web_uis_in_2026_portainer_isnt/p30fk5b/'
	},
	{
		id: 'ouqgl83',
		author: 'AmIBeingObtuse-',
		excerpt:
			"Arcane 🙌 love the ease of agent deployments for multiple systems control and dashboards all in one app. Full remote update and it's constantly being added to.",
		url: 'https://www.reddit.com/r/selfhosted/comments/1ujs1ee/whats_your_goto_these_days_for_dummyproof_web/ouqgl83/'
	},
	{
		id: 'nmlwzsd',
		author: 'bradmatt275',
		excerpt:
			'…the person who built it is really great. I logged a bug and they had a fix and a release ready within a week.',
		url: 'https://www.reddit.com/r/selfhosted/comments/1ol2y1j/anyone_using_arcane_for_docker_management_i_have/nmlwzsd/'
	},
	{
		id: 'pbf7ncm',
		author: 'astrofoundry',
		excerpt:
			'Arcane. I rarely see people recommending it, but it is better than most alternatives. Give it a try guys.',
		url: 'https://www.reddit.com/r/selfhosted/comments/1wnhg3b/portainer_cuts_the_cord_between_its_free_and_paid/pbf7ncm/'
	},
	{
		id: 'mqpisrr',
		author: 'DJ_Lobster',
		excerpt:
			'Really digging the UI and how simple it seems without sacrificing important features.',
		url: 'https://www.reddit.com/r/selfhosted/comments/1kf3mqr/release_arcane_docker_management_ui/mqpisrr/'
	},
	{
		id: 'p6e88l0',
		author: 'Subietoy78',
		excerpt:
			'Second on the arcane. Lightweight and has all the info I want. I used portainer prior and it was fine but arcane looks nicer and has a smaller footprint.',
		url: 'https://www.reddit.com/r/selfhosted/comments/1w0mnlz/what_are_you_using_to_manage_docker/p6e88l0/'
	},
	{
		id: 'mqnwkw7',
		author: 'GrumpyGander',
		excerpt:
			'Appears really well documented which is appreciated. I didn’t even have to spin up the container. Just read the documents and I feel like I know everything I need to.',
		url: 'https://www.reddit.com/r/selfhosted/comments/1kf3mqr/release_arcane_docker_management_ui/mqnwkw7/'
	},
	{
		id: 'o5bzxbl',
		author: 'Rufgar',
		excerpt:
			'Transferred off of portainer a while back and over to Arcane. It is so much better. Highly recommend it',
		url: 'https://www.reddit.com/r/selfhosted/comments/1r48ay5/anyone_else_find_portainer_isnt_all_that_great/o5bzxbl/'
	},
	{
		id: 'p6kxttx',
		author: 'comdude2',
		excerpt: 'I used dockge for years and have recently switched to Arcane. It’s amazing!',
		url: 'https://www.reddit.com/r/selfhosted/comments/1w0mnlz/what_are_you_using_to_manage_docker/p6kxttx/'
	},
	{
		id: 'ndwlzjp',
		author: 'falcorns_balls',
		excerpt:
			'It looks like a solid potential Portainer replacement. UI is nice. I like the quick little prune system button.',
		url: 'https://www.reddit.com/r/selfhosted/comments/1nfekvj/release_arcane_docker_management_v100/ndwlzjp/'
	},
	{
		id: 'o98ua3c',
		author: 'ZeroThaHero',
		excerpt:
			'Arcane wins hands down for me. … Point Arcane at your "stacks" folder and the rest is gravy.',
		url: 'https://www.reddit.com/r/selfhosted/comments/1rnimp6/dockge_alternative_based_on_docker_compose/o98ua3c/'
	},
	{
		id: 'pbfo7fj',
		author: 'planetearth80',
		excerpt:
			'Switched to Arcane and pretty happy with it. Only complaint is that I should have moved earlier',
		url: 'https://www.reddit.com/r/selfhosted/comments/1wnhg3b/portainer_cuts_the_cord_between_its_free_and_paid/pbfo7fj/'
	},
	{
		id: 'o6t0owv',
		author: 'Reasonable-Papaya843',
		excerpt:
			'I moved my entire homeland down to a 2 servers, both run arcane. I absolutely love it.',
		url: 'https://www.reddit.com/r/selfhosted/comments/1rbhyng/dockge_alternatives/o6t0owv/'
	},
	{
		id: 'mtaosrx',
		author: 'madeWithAi',
		excerpt:
			"I also like Arcane, it's modern and slick and has the features I want, replaced Portainer for me",
		url: 'https://www.reddit.com/r/selfhosted/comments/1kq0zg6/do_you_use_a_docker_manager_like_portainer/mtaosrx/'
	},
	{
		id: 'o97r0ae',
		author: 'Zerebos',
		excerpt:
			"For me Arcane uses virtually nothing and they're still adding more Komodo-like features such as local builds.",
		url: 'https://www.reddit.com/r/selfhosted/comments/1rnimp6/dockge_alternative_based_on_docker_compose/o97r0ae/'
	},
	{
		id: 'oxa1y2s',
		author: 'CptComputer',
		excerpt:
			'Another for Arcane, I used Portainer for awhile but Arcane is WAY better, and no limitations.',
		url: 'https://www.reddit.com/r/selfhosted/comments/1uum8fn/portainer_alternatives_what_are_you_using/oxa1y2s/'
	},
	{
		id: 'odzjx4p',
		author: 'anturk',
		excerpt:
			"…recently switched to Arcane i couldn't be happier how everything looks and works great.",
		url: 'https://www.reddit.com/r/selfhosted/comments/1salkni/laugh_at_my_pain_and_learn_from_my_mistakes/odzjx4p/'
	},
	{
		id: 'pbfg1xk',
		author: 'Arkarat',
		excerpt: 'For my newbie requirements, Arcane is a lot better and more solid.',
		url: 'https://www.reddit.com/r/selfhosted/comments/1wnhg3b/portainer_cuts_the_cord_between_its_free_and_paid/pbfg1xk/'
	},
	{
		id: 'o6slztj',
		author: 'Renoglodon',
		excerpt:
			'Another vote for Arcane. Switched from Portainer a couple of months ago and absolutely loving it.',
		url: 'https://www.reddit.com/r/selfhosted/comments/1rbhyng/dockge_alternatives/o6slztj/'
	},
	{
		id: 'ouqbtlu',
		author: 'drshajul',
		excerpt: 'Arcane.. it has matured a lot.. super easy and powerful.',
		url: 'https://www.reddit.com/r/selfhosted/comments/1ujs1ee/whats_your_goto_these_days_for_dummyproof_web/ouqbtlu/'
	},
	{
		id: 'o6qz7tv',
		author: 'kevintjuh93',
		excerpt: 'Arcane is what I switched to a month ago. Very happy with it! Give it a try :)',
		url: 'https://www.reddit.com/r/selfhosted/comments/1rbhyng/dockge_alternatives/o6qz7tv/'
	},
	{
		id: 'p5hj2zd',
		author: 'notboky',
		excerpt: "I've used all three, they're all excellent, settled on Arcane.",
		url: 'https://www.reddit.com/r/selfhosted/comments/1vwau48/trying_to_decide_what_to_use_for_gui_for_docker/p5hj2zd/'
	},
	{
		id: 'oxin8ep',
		author: 'isaac-varg',
		excerpt: 'I just switched to Arcane and I have really been enjoying it.',
		url: 'https://www.reddit.com/r/selfhosted/comments/1uum8fn/portainer_alternatives_what_are_you_using/oxin8ep/'
	},
	{
		id: 'o8ovtup',
		author: 'frazell',
		excerpt:
			'…in my limited testing of Arcane I like it more. All new docker loads will be in the Arcane hosts.',
		url: 'https://www.reddit.com/r/selfhosted/comments/1rkqtqv/do_you_use_portainer/o8ovtup/'
	},
	{
		id: 'p6qr2h9',
		author: 'YouKnowWhoAU',
		excerpt:
			"I was using portainer but for me it wasn't the easiest so I have since gone to arcane and it's been amazing.",
		url: 'https://www.reddit.com/r/selfhosted/comments/1w1zvnz/portainer_vs_dockhand_which_one_do_you_prefer_and/p6qr2h9/'
	},
	{
		id: 'oxbd6v2',
		author: 'ObscureQuotation',
		excerpt: 'I enjoy the interface, and the auto-update is nice',
		url: 'https://www.reddit.com/r/selfhosted/comments/1uum8fn/portainer_alternatives_what_are_you_using/oxbd6v2/'
	},
	{
		id: 'o29k940',
		author: 'iamgodofatheist',
		excerpt:
			"Found out about Arcane from this comment, and I can't thank you enough, kind stranger. That's exactly what I needed.",
		url: 'https://www.reddit.com/r/selfhosted/comments/1qmo0nx/komodo_docker_management/o29k940/'
	},
	{
		id: 'o98hrzj',
		author: 'p_235615',
		excerpt:
			'Arcane does just that - you point it to your directories with sub dirs with docker-compose.yaml files, and it can work with them completely fine.',
		url: 'https://www.reddit.com/r/selfhosted/comments/1rnimp6/dockge_alternative_based_on_docker_compose/o98hrzj/'
	},
	{
		id: 'ozzabei',
		author: 'shep_ling',
		excerpt: "it's getting a lot of traction now but for docker management Arcane is fantastic.",
		url: 'https://www.reddit.com/r/selfhosted/comments/1v7eegf/whats_an_incredibly_good_but_not_well_known_self/ozzabei/'
	},
	{
		id: 'mt35ixe',
		author: 'CGA1',
		excerpt:
			'I recently switched from Portainer to Arcane which is more than enough for my modest needs.',
		url: 'https://www.reddit.com/r/selfhosted/comments/1kq0zg6/do_you_use_a_docker_manager_like_portainer/mt35ixe/'
	},
	{
		id: 'o970h94',
		author: 'Abendsegl0r',
		excerpt: 'Or try Arcane, using it currently. Works and also nice ui.',
		url: 'https://www.reddit.com/r/selfhosted/comments/1rnimp6/dockge_alternative_based_on_docker_compose/o970h94/'
	},
	{
		id: 'pbgbr0x',
		author: 'Bimmou_55',
		excerpt: 'I went to arcane a few months ago, I highly recommend the transfer',
		url: 'https://www.reddit.com/r/selfhosted/comments/1wnhg3b/portainer_cuts_the_cord_between_its_free_and_paid/pbgbr0x/'
	},
	{
		id: 'ne6gbt7',
		author: 'Beneficial_Throat680',
		excerpt: "I've been using Arcane for a few days now and I love it!",
		url: 'https://www.reddit.com/r/selfhosted/comments/1nfekvj/release_arcane_docker_management_v100/ne6gbt7/'
	},
	{
		id: 'o5dhdi9',
		author: 'BudgetScore_',
		excerpt: 'Arcane is just on point. Love it.',
		url: 'https://www.reddit.com/r/selfhosted/comments/1r48ay5/anyone_else_find_portainer_isnt_all_that_great/o5dhdi9/'
	},
	{
		id: 'ozvqm0w',
		author: 'ahmedomar2015',
		excerpt: 'Arcane is by far the best!',
		url: 'https://www.reddit.com/r/selfhosted/comments/1v72mic/best_alternative_to_dockge/ozvqm0w/'
	},
	{
		id: 'p6kv5nv',
		author: 'Trevor68',
		excerpt: 'Arcane for me, so simple and easy.',
		url: 'https://www.reddit.com/r/selfhosted/comments/1w0mnlz/what_are_you_using_to_manage_docker/p6kv5nv/'
	},
	{
		id: 'o04qz5q',
		author: 'TheRealSeeThruHead',
		excerpt: 'I’m using arcane and enjoying it',
		url: 'https://www.reddit.com/r/selfhosted/comments/1qfhwy2/portainer_alternatives/o04qz5q/'
	},
	{
		id: 'ng8fkxc',
		author: 'tumz8',
		excerpt: 'Just set this up and loving it. Nice work!',
		url: 'https://www.reddit.com/r/selfhosted/comments/1kf3mqr/release_arcane_docker_management_ui/ng8fkxc/'
	},
	{
		id: 'oz7znva',
		author: 'nicq88',
		excerpt: 'switched from portainer to arcane I love it',
		url: 'https://www.reddit.com/r/selfhosted/comments/1kf3mqr/release_arcane_docker_management_ui/oz7znva/'
	},
	{
		id: 'p5jqf5t',
		author: 'TheAnonCodeJunkie',
		excerpt: 'Highly recommend Arcane!',
		url: 'https://www.reddit.com/r/selfhosted/comments/1vw1oqz/does_anyone_still_run_their_homelab_on_plain/p5jqf5t/'
	},
	{
		id: 'obkfmjh',
		author: 'mefistos',
		excerpt: 'I love Arcane!',
		url: 'https://www.reddit.com/r/selfhosted/comments/1rz1pns/whats_something_you_have_recently_removed_from/obkfmjh/'
	},
	{
		id: 'ozye1qs',
		author: 'Fade_Yeti',
		excerpt: 'Arcane is the best',
		url: 'https://www.reddit.com/r/selfhosted/comments/1v72mic/best_alternative_to_dockge/ozye1qs/'
	}
];
