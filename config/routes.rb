Rails.application.routes.draw do
   self.default_url_options = Rails.application.config.action_mailer.default_url_options

   # The priority is based upon order of creation: first created -> highest priority.
   # See how all your routes lay out with "rake routes".

   #authenticate :user, lambda { |u| u.admin? } do
      mount Sidekiq::Web => "/dashboard/sidekiq"
   #end

   #mount Tiun::Engine.routes => "/" ???
   Tiun.draw_routes(self)

   # auth routes
   get '/auth/github', to: 'auth#github', format: false

   # You can have the root of your site routed with "root"
   root 'memories#index'

   get '/about' => 'about#index'

   scope module: 'admin' do
      get '/dashboard' => 'common#dashboard'

      resources :memories, param: :id, except: :edit
      resources :calendaries, param: :id, except: :edit
      resources :memoes, param: :id, except: :edit
      resources :names, param: :id, except: :edit
      resources :orders, param: :id, except: :edit
      resources :subjects, param: :id, except: :edit
      resources :scripta, param: :id, except: :edit
      resources :readings, param: :id, except: :edit

      get '/short_subjects' => 'subjects#all'
      get '/short_orders' => 'orders#all'
      get '/short_calendaries' => 'calendaries#all'
      get '/short_memoes' => 'memoes#all'
      get '/short_full_memoes' => 'memoes#memoried'
      get '/short_events' => 'events#all'
      get '/short_memories' => 'memories#all'
      get '/short_names' => 'names#all'
      get '/short_nomina' => 'nomina#all'
      get '/short_places' => 'places#all'
      get '/short_items' => 'items#all'
      get '/short_scripta' => 'scripta#all'
      get '/short_readings' => 'readings#all'
      get '/icons' => 'memories#icons'
   end

   get '/index' => 'memories#index'
   get '/:lat' => 'errors#show', constraints: { lat: /[a-z]+/ }

   get '/:slug' => 'memories#show', as: :slug#, constraints: { slug: /[ёа-я0-9]{1,6}/ }
   get '/:slug/gallery' => 'gallery#index', as: :gallery#, constraints: { slug: /[ёа-я0-9]{1,6}/ }
   #get '/:slug/gallery/:uid' => 'gallery#show', as: :picture#, constraints: { slug: /[ёа-я0-9]{1,6}/ }
   get '/:slug/:event' => 'events#show', as: :slug_event, constraints: { event: /[0-9]{1,6}/ }
   get '/:slug/:event/gallery' => 'gallery#index', as: :event_gallery, constraints: { event: /[0-9]{1,6}/ }
   get '/:c/:slug' => 'memories#show', as: :cslug
   get '/:c/:slug/:event' => 'events#show', as: :cslug_event, constraints: { event: /[0-9]{1,6}/ }
end
