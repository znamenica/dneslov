class Admin::CalendariesController < Admin::CommonController
   protected

   def index_with_list
      %w(with_slug with_locale_names with_descriptions with_links)
   end

   def permitted_params
      params.require( :calendary ).permit( :id, :licit, :language_code, :alphabeth_code, :author_name, :date, :council,
                                            slug_attributes: [:id, :text],
                                            titles_attributes: [:id, :text, :language_code, :alphabeth_code, :_destroy],
                                            wikies_attributes: [:id, :url, :language_code, :alphabeth_code, :_destroy],
                                            beings_attributes: [:id, :url, :language_code, :alphabeth_code, :_destroy],
                                            descriptions_attributes: [:id, :text, :language_code, :alphabeth_code, :_destroy] ) ;end;end
