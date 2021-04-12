class Admin::OrderSerializer < ApplicationSerializer
   attributes :id, :slug, :tweets, :notes, :descriptions

   def slug
      object._slug ;end

   def tweets
      object._descriptions.select { |d| d['type'] == 'Tweet' } ;end

   def notes
      object._descriptions.select { |d| d['type'] == 'Note' } ;end

   def descriptions
      object._descriptions.select { |d| d['type'] == 'Description' } ;end;end
