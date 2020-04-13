class Admin::CalendariesController < Admin::CommonController
   protected

   def permitted_params
      params.require( :calendary ).permit( :id, :licit, :language_code, :alphabeth_code, :author_name, :date, :council,
                                            slug_attributes: [:id, :text],
                                            names_attributes: [:id, :text, :language_code, :alphabeth_code, :_destroy],
                                            wikies_attributes: [:id, :url, :language_code, :alphabeth_code, :_destroy],
                                            links_attributes: [:id, :url, :language_code, :alphabeth_code, :_destroy],
                                            descriptions_attributes: [:id, :text, :language_code, :alphabeth_code, :_destroy] ) ;end;end
