class Admin::ShortSubjectSerializer < ApplicationSerializer
   attributes :key, :name

   def name
      object._descriptions.find {|d| locales.include?(d["language_code"].to_sym) }["text"] ;end;end
