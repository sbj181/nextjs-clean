import type { NextApiRequest, NextApiResponse } from 'next';
import { isValidSecret } from 'sanity-plugin-iframe-pane/is-valid-secret';

import { previewSecretId, readToken } from '~/lib/sanity.api';
import { getClient } from '~/lib/sanity.client';

export default async function preview(req: NextApiRequest, res: NextApiResponse<string | void>) {
  if (!readToken) {
    res.status(500).send('Misconfigured server');
    return;
  }

  const { query } = req;
  const secret = typeof query.secret === 'string' ? query.secret : undefined;
  const slug = typeof query.slug === 'string' ? query.slug : undefined;
  const type = typeof query.type === 'string' ? query.type : undefined;

  if (!secret) {
    res.status(401).send('Invalid secret');
    return;
  }

  const authClient = getClient({ token: readToken }).withConfig({
    useCdn: false,
    token: readToken,
  });

  const validSecret = await isValidSecret(authClient, previewSecretId, secret);
  if (!validSecret) {
    return res.status(401).send('Invalid secret');
  }

  if (slug && type) {
    res.setDraftMode({ enable: true });

    if (type === 'post') {
      res.writeHead(307, { Location: `/post/${slug}` });
    } else if (type === 'resource') {
      res.writeHead(307, { Location: `/resource/${slug}` });
    } else {
      res.status(400).send('Invalid type');
      return;
    }

    res.end();
    return;
  }

  res.status(404).send('Slug and type query parameters are required');
  res.end();
}
