defmodule SimWeb.Router do
  use SimWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/" do
    pipe_through :browser
  end

  scope "/sim" do
    scope "/", SimWeb do
      pipe_through :browser

      get "/", PageController, :index
    end

    scope "/api", SimWeb do
      pipe_through :api

      get "/state/:id", StateController, :show

      scope "/game" do
        get "/new/:name", StateController, :new
        get "/start/:name", StateController, :start
      end
    end
  end
end
