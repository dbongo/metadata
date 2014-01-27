package controllers

import play.api._
import play.api.mvc._

import reactivemongo.api._
import play.modules.reactivemongo._
import play.modules.reactivemongo.json.collection.JSONCollection

import play.api.libs.json._
import scala.concurrent._
import scala.concurrent.ExecutionContext.Implicits.global

object Rest extends Controller with MongoController {

	/**
	 * Get a JSONCollection (a Collection implementation that is designed to work with JsObject, Reads and Writes.)
	 * Note that the `collection` is not a `val`, but a `def`. We do _not_ store
	 * the collection reference to avoid potential problems in development with
	 * Play hot-reloading
	 */
	def collection = db.collection[JSONCollection]("entities")

	// get all documents from the db
	def findAll = Action.async {
		//retrieve all data from the collection
		collection
		  .find(Json.obj())
		  .cursor[JsObject]
		  .collect[List]()
		  .map { entities =>
		    println("!!! GET ALL !!!")
		    Ok(Json.toJson(entities))
		  }
	}

	// queries for an entity by name
  def getByName(name: String) = Action.async {
  	// retrieve all data from the collection
  	collection
  	  .find(Json.obj("name" -> name)) // find all entities with the name `name`
  	  .sort(Json.obj("created" -> -1)) // sort them by creation date
  	  .cursor[JsObject] // perform the query and get a cursor of JsObject
  	  .collect[List]() // gather all the JsObjects in a list => we get Future
  	  .map { entities =>
  	    println("!!! GET by name !!!")
  	    Ok(Json.arr(entities))
  	  }
  }

  // create new Document in db
  def create = Action.async(parse.json) { request =>
  	val json = request.body.as[JsObject] + ("created" -> JsNumber(new java.util.Date().getTime()))

  	collection
  	  .insert(json)
  	  .map(lastError => {
  	  	println("!!! CREATE !!!")
  	  	Ok("Mongo LastError: %s".format(lastError))
  	  })
  }

  // update Document in db by _id
  def update(oid: String) = Action.async(parse.json) { request =>
  	println(request.body)
  	println(oid)
  	collection
  	  .update(Json.obj("_id" -> Json.obj("$oid" -> oid)), Json.obj("$set" -> request.body))
  	  .map(lastError => {
  	  	println("!!! UPDATE !!!")
  	  	Ok("Mongo LastError: %s".format(lastError))
  	  })
  }

  // delete Document from the db
  def delete(oid: String) = Action.async { request =>
  	collection
  	  .remove(Json.obj("_id" -> Json.obj("$oid" -> oid)))
  	  .map(lastError => {
  	  	println("!!! DELETE !!!")
  	  	Ok("Mongo LastError: %s".format(lastError))
  	  })
  }
}