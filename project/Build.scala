import sbt._
import Keys._
import play.Project._

object ApplicationBuild extends Build {

  val appName = "metadata"
  val appVersion = "1.0.1-SNAPSHOT"

  val appDependencies = Seq(
    // Add your project dependencies here,
    jdbc,
    anorm,
    filters,
    // Adding WebJars dependencies
    "org.webjars" % "angularjs" % "1.2.9",
    "org.webjars" % "requirejs" % "2.1.10",
    "org.webjars" %% "webjars-play" % "2.2.1",
    "org.webjars" % "restangular" % "1.2.2",
    "org.webjars" % "ng-grid" % "2.0.7",
    "org.webjars" % "underscorejs" % "1.5.2-2",
    // Adding MongoDB dependencies
    "org.reactivemongo" %% "play2-reactivemongo" % "0.11.0-SNAPSHOT")

  val appResolvers = Seq(
    "Sonatype Snapshots" at "http://oss.sonatype.org/content/repositories/snapshots/")

  val main = play.Project(appName, appVersion, appDependencies).settings( // Add your own project settings here      
    resolvers ++= appResolvers,
    playAssetsDirectories <+= baseDirectory / "ngApps")

}
