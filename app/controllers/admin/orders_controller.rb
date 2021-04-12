class Admin::OrdersController < Admin::CommonController
   protected

   def with_list
      %w(with_descriptions with_slug) ;end

   def permitted_params
      params.require( :order ).permit(
         :id,
         slug_attributes: [:id, :text],
         notes_attributes: [:id, :text, :language_code, :alphabeth_code, :_destroy],
         tweets_attributes: [:id, :text, :language_code, :alphabeth_code, :_destroy],
         descriptions_attributes: [:id, :text, :language_code, :alphabeth_code, :_destroy] ) ;end;end
