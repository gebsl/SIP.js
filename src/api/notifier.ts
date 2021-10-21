/**
 * ATTENTION:
 *
 * This class has been implemented by gebsl <unterholzer.gabriel@gmail.com> and is most probably
 * !!! NOT COMPLIANT WITH SIP STANDARDS FOR NOTIFICATIONS !!!
 *
 * It's just a foolish try to implement NOTIFY functionality in SIP.js
 *
 * Mostly this implementation has just been copy-pasted from
 * the official `Publisher` implementation.
 */

import { Body, C, fromBodyLegacy, OutgoingNotifyRequest, OutgoingRequestMessage, URI } from "../core";
import { NotifierOptions } from "./notifier-options";
import { UserAgent } from "./user-agent";

/**
 * A notifier notifies a notification (outgoing NOTIFY).
 * @public
 */
export class Notifier {
  private event: string;
  private options: NotifierOptions;
  private target: URI;

  private request: OutgoingRequestMessage;
  private userAgent: UserAgent;

  /**
   * Constructs a new instance of the `Publisher` class.
   *
   * @param userAgent - User agent. See {@link UserAgent} for details.
   * @param targetURI - Request URI identifying the target of the message.
   * @param eventType - The event type identifying the published document.
   * @param options - Options bucket. See {@link PublisherOptions} for details.
   */
  public constructor(userAgent: UserAgent, targetURI: URI, eventType: string, options: NotifierOptions = {}) {
    this.userAgent = userAgent;

    options.extraHeaders = (options.extraHeaders || []).slice();
    options.contentType = options.contentType || "text/plain";

    this.target = targetURI;
    this.event = eventType;
    this.options = options;

    const params = options.params || {};
    const fromURI = params.fromUri ? params.fromUri : userAgent.userAgentCore.configuration.aor;
    const toURI = params.toUri ? params.toUri : targetURI;
    let body: Body | undefined;
    if (options.body && options.contentType) {
      const contentDisposition = "render";
      const contentType = options.contentType;
      const content = options.body;
      body = {
        contentDisposition,
        contentType,
        content
      };
    }
    const extraHeaders = (options.extraHeaders || []).slice();

    // Build the request
    this.request = userAgent.userAgentCore.makeOutgoingRequestMessage(
      C.NOTIFY,
      targetURI,
      fromURI,
      toURI,
      params,
      extraHeaders,
      body
    );
  }

  /**
   * Notify.
   * @param content - Body to notify
   */
  public notify(content: string): Promise<void> {
    // is Initial or Modify request
    this.options.body = content;

    this.sendNotifyRequest();

    return Promise.resolve();
  }

  private sendNotifyRequest(): OutgoingNotifyRequest {
    const reqOptions = { ...this.options };

    reqOptions.extraHeaders = (this.options.extraHeaders || []).slice();

    reqOptions.extraHeaders.push("Event: " + this.event);

    const ruri = this.target;
    const params = this.options.params || {};

    let body: Body | undefined;
    if (this.options.body) {
      body = fromBodyLegacy(this.options.body);
    }

    this.request = this.userAgent.userAgentCore.makeOutgoingRequestMessage(
      C.NOTIFY,
      ruri,
      params.fromUri ? params.fromUri : this.userAgent.userAgentCore.configuration.aor,
      params.toUri ? params.toUri : this.target,
      params,
      reqOptions.extraHeaders,
      body
    );

    return this.userAgent.userAgentCore.request(this.request);
  }
}
