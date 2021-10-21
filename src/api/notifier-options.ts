import { URI } from "../core";

/**
 * Options for {@link Notifier} constructor.
 * @public
 */
export interface NotifierOptions {
  /** @deprecated TODO: provide alternative. */
  body?: string;
  /** @deprecated TODO: provide alternative. */
  contentType?: string;
  /**
   * Array of extra headers added to the PUBLISH request message.
   */
  extraHeaders?: Array<string>;
  /** @deprecated TODO: provide alternative. */
  params?: {
    fromDisplayName?: string;
    fromTag?: string;
    fromUri?: URI;
    toDisplayName?: string;
    toUri?: URI;
  };
}
