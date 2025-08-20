export interface SplideOptions {
 type?: 'slide' | 'loop' | 'fade';
 autoplay?: boolean;
 interval?: number;
 speed?: number;
 easing?: string;
 arrows?: boolean;
 pagination?: boolean;
 drag?: boolean;
 keyboard?: boolean;
 wheel?: boolean;
 perPage?: number;
 perMove?: number;
 gap?: string | number;
 pauseOnHover?: boolean;
 pauseOnFocus?: boolean;
 resetProgress?: boolean;
 rewind?: boolean;
 waitForTransition?: boolean;
 updateOnMove?: boolean;
 breakpoints?: {
   [key: number]: {
     perPage?: number;
     gap?: string | number;
     speed?: number;
   };
 };
}