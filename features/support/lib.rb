# frozen_string_literal: true

module Spec
   def described_class
      kls = yield if block_given?
      @described_class = kls || @described_class
   end

   def is_expected
      expect(subject)
   end

   def subject
      described_class.is_a?(Class) ? described_class.new : described_class
   end

   def json_body
      JSON.load(@response.body)
   end

   # matcher
   class InvalidObjectMatchError < StandardError; end

   def error object, real, path = [], exception: true
      text = "Invalid object match #{object} at path #{path.join('.')}, got #{real}"

      if exception
         Kernel.puts(text)
         raise InvalidObjectMatchError.new(text)
      end

      false
   end

   def deep_match obj, to_obj, path = [], exception: true
      case to_obj
      when Array
         array_match(obj, to_obj, path, exception:)
      when Hash
         hash_match(obj, to_obj, path, exception:)
      when String
         return error(to_obj, obj, path, exception:) if obj.to_s != to_obj
      when Integer
         return error(to_obj, obj, path, exception:) if obj.to_i != to_obj
      else
         return error(to_obj, obj, path, exception:) if obj.class != to_obj.class || obj != to_obj
      end

      true
   end

   def array_match array_in, to_array, path, exception: true
      array = array_in.dup

      error(to_array, array, path, exception:) if [array, to_array].any? {|x| !x.class.ancestors.include?(Enumerable) }

      to_array.map.with_index do |to_val, index|
         idx =
            array.index do |val|
               deep_match(val, to_val, path | [index], exception: false)
            end

         idx ? array.delete_at(idx) : error(to_val, array[index], path | [index], exception:)
      end.any?
   end

   def hash_match hash, to_hash, path, exception: true
      error(to_hash, hash, path, exception:) if [hash, to_hash].any? {|x| !(x.class.ancestors & [Hash, ActiveRecord::Base]).any? }

      to_hash.map do |(to_key, to_val)|
         value = hash.respond_to?(to_key) ? hash.send(to_key) : hash[to_key]

         deep_match(value, to_val, path | [to_key], exception:)
      end.any?
   end
end

module Support
   def sign_up options = {}
      current_user_build

      visit "/users/sign_up"
      fill_in "user[email]", with: options[:email] || current_user.email
      fill_in "user[password]", with: options[:password] || current_user.password
      fill_in "user[password_confirmation]", with: options[:password_confirmation] || current_user.password_confirmation
      click_button "Sign up"
   end

   def sign_out
      delete "/users/sign_out"
   end

   def sign_in options = {}
      visit "/users/sign_in"
      fill_in "user[email]", with: options[:email] || current_user.email
      fill_in "user[password]", with: options[:password] || current_user.password
      click_button "Log in"
   end

   def form_fill_in options = {}
      @options = options

      visit "/users/edit"
      fill_in "user[email]", with: options[:email] || current_user.email
      fill_in "user[current_password]", with: options[:current_password] || current_user.password
      fill_in "user[password]", with: options[:password]
      fill_in "user[password_confirmation]", with: options[:password]
   end

   def current_user
      @current_user ||= FactoryBot.create(:user)
   end

   def current_user_build
      @current_user ||= FactoryBot.build(:user)
   end

   def current_user_with options
      @current_user ||= FactoryBot.build(:user, options)
   end

   def drop_current_user
      @current_user = FactoryBot.build(:user)
   end

   def current_novelty
      @current_novelty ||= FactoryBot.create(:novelty)
   end

   def current_librum
      @current_librum ||= FactoryBot.create(:librum)
   end
end

World(Spec)
World(Support)
