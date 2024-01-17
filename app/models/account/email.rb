class Account::Email < Account
   def validate_url
     File.join *[ImageUploader.asset_host.to_s, 'token', CGI.escape(validate_token.code)]
   end
end
