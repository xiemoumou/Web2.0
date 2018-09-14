/**
 * Created by inshijie on 2018/5/15.
 */
var commonData={
    "productType":'',
    "texturename":'',
    "accessoriesname":'',
    "technology":'<label><input class="mold-cbx-none" value="无" type ="checkbox" >无</label><label><input value="浇铸" type ="checkbox" class="mold-single">浇铸</label><label><input value="模切" type ="checkbox" class="mold-single">模切</label><label><input value="双面开模" type ="checkbox" class="mold-single doubleSidedMold">双面开模</label><label><input value="2D冲压" type ="checkbox" class="mold-drop-cbx">2D冲压</label><label><input value="2D压铸" type ="checkbox" class="mold-drop-cbx">2D压铸</label><label><input value="2D液压" type ="checkbox" class="mold-drop-cbx">2D液压</label><label><input value="3D冲压" type ="checkbox" class="mold-drop-cbx">3D冲压</label><label><input value="3D压铸" type ="checkbox" class="mold-drop-cbx">3D压铸</label><label><input value="3D液压" type ="checkbox" class="mold-drop-cbx">3D液压</label>',
    "machining":'',
    "color":''
};

if(typeof parent.Main!="undefined")
{
    var dropList=parent.Main.dropList;
    commonData.productType=dropList.productType;
    commonData.texturename=dropList.texturename;
    commonData.accessoriesname=dropList.accessoriesname;
    commonData.machining=dropList.machining;
    commonData.color=dropList.color;
}