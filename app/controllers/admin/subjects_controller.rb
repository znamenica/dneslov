class Admin::SubjectsController < Admin::CommonController
   has_scope :k, only: %i(all)

   protected

   def permitted_params
      params.require( :subject )
            .permit( :id, :key, :meta, :kind,
                     names_attributes: %i(id text language_code alphabeth_code _destroy),
                     descriptions_attributes: %i(id text language_code alphabeth_code _destroy) ) ;end;end
