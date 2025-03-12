const supabase = require("../utils/supabase");

const signedUrlCache = {};

const checkFileExists = async (bucket, filePath) => {
  const { data, error } = await supabase.storage.from(bucket).list();
  if (error) return false;
  return data.some((file) => file.name === filePath);
};

const getSignedUrl = async (bucket, filePath) => {
  const cacheKey = `${bucket}/${filePath}`;

  if (
    signedUrlCache[cacheKey] &&
    signedUrlCache[cacheKey].expires > Date.now()
  ) {
    return signedUrlCache[cacheKey].url;
  }

  if (!(await checkFileExists(bucket, filePath))) {
    return null;
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(filePath, 60 * 60 * 24);
  if (error) return null;

  signedUrlCache[cacheKey] = {
    url: data.signedUrl,
    expires: Date.now() + 60 * 60 * 24 * 1000,
  };

  return data.signedUrl;
};

module.exports = {
  checkFileExists,
  getSignedUrl,
};
