class AuthController < ApplicationController
   include UloginAuth
   include GithubAuth
end
