import { buttonVariants } from '../../lib/components/ui/button/index';

export const button = {
	primary: buttonVariants({ variant: 'default' }),
	primaryLg: buttonVariants({ variant: 'default', size: 'lg' }),
	outline: buttonVariants({ variant: 'outline' }),
	outlineLg: buttonVariants({ variant: 'outline', size: 'lg' }),
	outlineSm: buttonVariants({ variant: 'outline', size: 'sm' })
};
